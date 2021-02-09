/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')

const IN_PARALLEL = 100
const processName = 'stock-symbols'

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
    }

    await Promise.all(promises)

    promises = []
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.stockSymbols = new CronJob('0 11 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 11am')

    try {
      await updateStockSymbols()
    } catch (err) {
      logger.error({ processName, err }, 'Failed to update stock symbols')
    }

    logger.info({ processName }, 'Done')
  }

}, null, true, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateStockSymbols()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
