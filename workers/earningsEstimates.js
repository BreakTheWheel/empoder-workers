/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handleEarning(symbol, earning) {
  try {
    const exists = await db.EarningsEstimate.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', earning.period),
        ],
        symbol,
      },
    })

    if (!exists) {
      await db.EarningsEstimate.create(earning)
    }
  } catch (err) {
    logger.error({ err }, `Failed to store earnings estimate for symbol ${symbol}`)
  }
}

async function updateEarningsEstimates() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    let earnings

    while (!earnings) {
      try {
        earnings = await finhub.earningsEstimate({ symbol })
      } catch (err) {
        logger.error({ err }, 'Failed to get earnings estimate')
        await wait(2)
      }
    }

    for (const earning of earnings.data) {
      logger.info(`earnings estimates: ${symbol}`)

      earning.symbol = symbol

      promises.push(await handleEarning(symbol, earning))
    }

    await Promise.all(promises)

    await wait(1)

    promises = []
  }
}

module.exports.updateEarningsEstimates = new CronJob('0 8 * * *', async () => {
  logger.info('Running every day at 8am')

  try {
    await updateEarningsEstimates()
  } catch (err) {
    logger.error({ err }, 'Failed in updating earnings estimates')
  }

  logger.info('Done')
}, null, true, 'America/New_York');


// (async function () {
//   try {
//     await updateEarningsEstimates()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
