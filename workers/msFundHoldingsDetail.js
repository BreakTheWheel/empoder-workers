/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const Promise = require('bluebird')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-market-cap'

async function handleItem(symbol, item) {
  const exists = await db.MsFundHoldingsDetail.findOne({
    where: {
      stockSymbolId: symbol.id,
      secId: item.SecId,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', item.AsOfDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(item)) {
    obj[camelCase(key)] = item[key]
  }

  if (exists) {
    try {
      await db.MsFundHoldingsDetail.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          secId: item.SecId,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', item.AsOfDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsfundHoldingsDetail option')
    }
  } else {
    try {
      await db.MsFundHoldingsDetail.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsfundHoldingsDetail option')
    }
  }
}

async function updateFundHoldingsDetail() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    const fundHoldingsDetail = await requestHelper(processName, () => morningstar.fundHoldingsDetail({
      token,
      exchangeId: symbol.exchangeId,
      symbol: symbol.symbol,
    }))

    if (!fundHoldingsDetail || !fundHoldingsDetail.FundHoldingsDetailEntityList || Object.keys(fundHoldingsDetail.FundHoldingsDetailEntityList).length === 0) {
      continue
    }

    let promises = []

    for (const item of fundHoldingsDetail.FundHoldingsDetailEntityList) {
      promises.push(handleItem(symbol, item))

      if (promises.length === 100) {
        await Promise.all(promises)

        promises = []
      }
    }

    await Promise.all(promises)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateFundHoldingsDetail = new CronJob('0 16 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 4pm')

    try {
      await updateFundHoldingsDetail()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating fund holdings detail cap')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateFundHoldingsDetail()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
