/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function updatePriceTargets() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(s => s.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`updatePriceTargets Processing symbol: ${symbol}`)
    let priceTarget

    while (!priceTarget) {
      try {
        priceTarget = await finhub.priceTarget({ symbol })
      } catch (err) {
        logger.error({ err }, 'Failed on FN price target endpoint')
        await wait(2)
      }
    }

    if (!priceTarget || !priceTarget.symbol) {
      continue
    }

    const exists = await db.PriceTarget.findOne({
      where: {
        symbol,
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '=', priceTarget.lastUpdated),
        ],
      },
    })

    if (!exists) {
      await db.PriceTarget.create(priceTarget)
      logger.info(`Created price target for symbol: ${symbol}`)
    } else {
      await db.PriceTarget.update(priceTarget, {
        where: {
          symbol,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '=', priceTarget.lastUpdated),
          ],
        },
      })
      logger.info(`Updated price target for symbol: ${symbol}`)
    }
  }
}

module.exports.priceTarget = new CronJob('0 1 * * *', async () => {
  logger.info('Running every day at 1am')

  try {
    await updatePriceTargets()
  } catch (err) {
    logger.error({ err }, 'Failed in updating price targets')
  }

  logger.info('Done')
}, null, true, 'America/New_York');

// (async function () {
//   try {
//     await updatePriceTargets()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
