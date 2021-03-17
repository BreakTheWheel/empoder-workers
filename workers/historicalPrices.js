/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const iexCloud = require('../src/services/iexCloud')
const { wait, requestHelper } = require('../src/utils/helperFuncs')
const stockService = require('../src/services/stockService')

const processName = 'historical-prices'

async function handlePrice(symbol, price) {
  delete price.id

  try {
    const exists = await db.HistoricalPrice.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), '=', price.date),
        ],
        symbol,
      },
    })

    if (!exists) {
      await db.HistoricalPrice.create(price)
    }
  } catch (err) {
    logger.error({ processName, err }, `Failed to store historical price for symbol ${symbol}`)
  }
}

async function updateHistoricalPrices() {
  let stockSymbols = await stockService.getTrackingStocks()
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    const date = moment().subtract(1, 'day').format('YYYYMMDD')
    logger.info(`Historical price: ${symbol}, date: ${date}`)

    const prices = await requestHelper(processName, () => iexCloud.historicalPrices({ symbol, date }))

    if (!prices) {
      continue
    }

    for (const price of prices) {
      price.symbol = symbol

      await handlePrice(symbol, price)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

// Data schedule: Prior trading day adjusted data available after 4am ET Tue-Sat
module.exports.updateHistoricalPrices = new CronJob('0 6 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 6am')

    try {
      await updateHistoricalPrices()
    } catch (err) {
      logger.error({ err }, 'Failed in updating recommendation trends')
    }

    logger.info({ processName }, 'Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateHistoricalPrices()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
