/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const moment = require('moment')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-growth-ratios'

const types = ['Annual', 'Quarterly']

async function handleItem(symbol, item) {
  const exists = await db.MsGrowthRatio.findOne({
    where: {
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', item.PeriodEndingDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(item)) {
    obj[camelCase(key)] = item[key]
  }

  if (exists) {
    try {
      await db.MsGrowthRatio.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', item.PeriodEndingDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in updating MsGrowthRatio')
    }
  } else {
    try {
      await db.MsGrowthRatio.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsGrowthRatio')
    }
  }
}

async function growthRatios() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  const startYear = moment().subtract(2, 'year').year()
  const endYear = moment().year()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    for (const type of types) {
      const ratio = await requestHelper(processName, () => morningstar.growthRatios({
        token,
        exchangeId: symbol.exchangeId,
        symbol: symbol.symbol,
        startDate: `01/${startYear}`,
        endDate: `12/${endYear}`,
        type,
      }))

      if (!ratio || !ratio.GrowthEntityList || Object.keys(ratio.GrowthEntityList).length === 0) {
        continue
      }

      for (const item of ratio.GrowthEntityList) {
        await handleItem(symbol, item, type)
      }
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.growthRatios = new CronJob('0 17 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 5pm')

    try {
      await growthRatios()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating institutional holdings detail cap')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await growthRatios()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
