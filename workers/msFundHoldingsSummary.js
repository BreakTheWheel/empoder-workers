/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-fund-holdings-summary'

async function handleItem(symbol, item) {
  const exists = await db.MsFundHoldingsSummary.findOne({
    where: {
      stockSymbolId: symbol.id,
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
      await db.MsFundHoldingsSummary.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', item.AsOfDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsFundHoldingsSummary option')
    }
  } else {
    try {
      await db.MsFundHoldingsSummary.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsFundHoldingsSummary option')
    }
  }
}

async function updateFundHoldingsSummary() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    const fundHoldingsSummary = await requestHelper(processName, () => morningstar.fundHoldingsSummary({
      token,
      exchangeId: symbol.exchangeId,
      symbol: symbol.symbol,
    }))

    if (!fundHoldingsSummary || !fundHoldingsSummary.FundHoldingsSummaryEntity || Object.keys(fundHoldingsSummary.FundHoldingsSummaryEntity).length === 0) {
      continue
    }

    await handleItem(symbol, fundHoldingsSummary.FundHoldingsSummaryEntity)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateFundHoldingsSummary = new CronJob('0 16 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 4pm')

    try {
      await updateFundHoldingsSummary()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating fund holdings detail cap')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateFundHoldingsSummary()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
