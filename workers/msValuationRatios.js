/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-valuation-ratios'

async function handlValuationRatio(symbol, valuationRatio) {
  const exists = await db.MsValuationRatio.findOne({
    where: {
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', valuationRatio.AsOfDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(valuationRatio)) {
    obj[camelCase(key)] = valuationRatio[key]
  }

  if (exists) {
    try {
      await db.MsValuationRatio.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', valuationRatio.AsOfDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsValuationRatio option')
    }
  } else {
    try {
      await db.MsValuationRatio.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsValuationRatio option')
    }
  }
}

async function updateValuationRatios() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    const valudationRatios = await requestHelper(processName, () => morningstar.valuationRatios({
      token,
      exchangeId: symbol.exchangeId,
      symbol: symbol.symbol,
    }))

    if (!valudationRatios || !valudationRatios.ValuationRatioEntityList || Object.keys(valudationRatios.ValuationRatioEntityList).length === 0) {
      continue
    }

    for (const ratio of valudationRatios.ValuationRatioEntityList) {
      await handlValuationRatio(symbol, ratio)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateValuationRatios = new CronJob('0 20 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 8pm')

    try {
      await updateValuationRatios()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating valuation ratios')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateValuationRatios()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}

