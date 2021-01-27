/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const iexCloud = require('../src/services/iexCloud')
const { wait } = require('../src/utils/helperFuncs')

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
    logger.error({ err }, `Failed to store hisotircal price for symbol ${symbol}`)
  }
}

async function updateHistoricalPrices() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    const date = moment().subtract(1, 'day').format('YYYYMMDD')
    let prices

    while (!prices) {
      try {
        prices = await iexCloud.historicalPrices({ symbol, date })
      } catch (err) {
        logger.error({ err: err.response }, 'Failed to get prices')
        await wait(5)
      }
    }

    for (const price of prices) {
      logger.info(`Historical price: ${symbol}, date: ${date}`)

      price.symbol = symbol

      await handlePrice(symbol, price)
    }
  }
}

module.exports.updateHistoricalPrices = new CronJob('0 5 * * *', async () => {
  logger.info('Running every day at 5am')

  try {
    await updateHistoricalPrices()
  } catch (err) {
    logger.error({ err }, 'Failed in updating recommendation trends')
  }

  logger.info('Done')
}, null, true, 'America/New_York');

// (async function () {
//   try {
//     await updateHistoricalPrices()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
