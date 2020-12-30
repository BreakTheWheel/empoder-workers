/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')

async function updateStockSymbols() {
  const symbols = await finhub.stockSymbols({ exchange: 'us' })

  for (const sym of symbols) {
    const exists = await db.StockSymbol.findOne({
      where: { symbol: sym.symbol },
    })

    if (!exists) {
      await db.StockSymbol.create({
        ...sym,
        exchange: 'us',
      })
    }
  }
}

module.exports.stockSymbols = new CronJob('36 11 * * *', async () => {
  logger.info('Running every 1 min')

  try {
    await updateStockSymbols()
  } catch (err) {
    logger.error({ err }, 'Failed to update stock symbols')
  }

  logger.info('Done')
}, null, true, 'Europe/Skopje');


// (async function () {
//   try {
//     await updateStockSymbols()
//   } catch (err) {
//     console.log(err)
//   }
// })()