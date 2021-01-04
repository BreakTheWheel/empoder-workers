/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const Promise = require('bluebird')

const IN_PARALLEL = 50

async function storeSymbol(sym) {
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

async function updateStockSymbols() {
  const symbols = await finhub.stockSymbols({ exchange: 'us' })

  let promises = []

  for (const sym of symbols) {
    const promise = storeSymbol(sym)

    promises.push(promise)

    if (promises.length === IN_PARALLEL) {
      await Promise.all(promises)

      promises = []

      logger.info(`added ${IN_PARALLEL}`)
    }
  }
}

module.exports.stockSymbols = new CronJob('30 8 * * *', async () => {
  logger.info('Running every day at 8:30 CET')

  try {
    await updateStockSymbols()
  } catch (err) {
    logger.error({ err }, 'Failed to update stock symbols')
  }

  logger.info('Done')
}, null, true, 'Europe/Skopje');
