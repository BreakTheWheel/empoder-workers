/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')

async function wait(secs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, secs * 1000)
  })
}

async function updatePriceTargets() {
  const stockSymbols = await db.StockSymbol.findAll({
    where: {},
  })

  for (const stock of stockSymbols) {
    let priceTarget

    while (!priceTarget) {
      try {
        priceTarget = await finhub.priceTarget({ symbol: stock.symbol })
      } catch (err) {
        logger.error({ err }, 'Failed on FN price target endpoint')
        await wait(2)
      }
    }

    if (!priceTarget || !priceTarget.symbol) {
      continue
    }

    const exists = await db.PriceTarget.findOne({
      where: { symbol: stock.symbol, lastUpdated: priceTarget.lastUpdated },
    })

    if (!exists) {
      await db.PriceTarget.create(priceTarget)
    }
  }
}

module.exports.priceTarget = new CronJob('*/1 * * * *', async () => {
  logger.info('Running every 1 min')

  try {
    await updatePriceTargets()
  } catch (err) {
    logger.error({ err }, 'Failed in updating price targets')
  }

  logger.info('Done')
}, null, true, 'America/Los_Angeles');


// (async function () {
//   try {
//     await updatePriceTargets()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()