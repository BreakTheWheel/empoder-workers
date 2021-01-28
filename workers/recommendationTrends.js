/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handleTrend(symbol, trend) {
  try {
    const exists = await db.RecommendationTrend.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', trend.period),
        ],
        symbol,
      },
    })

    if (!exists) {
      await db.RecommendationTrend.create(trend)
    } else {
      await db.RecommendationTrend.update(trend, {
        where: {
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', trend.period),
          ],
          symbol,
        },
      })
    }
  } catch (err) {
    logger.error({ err }, `Failed to store trend for symbol ${symbol}`)
  }
}

async function updateRecommendationTrends() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    let trends

    while (!trends) {
      try {
        trends = await finhub.recommendationTrends({ symbol })
      } catch (err) {
        logger.error({ err }, 'Failed to get trends')
        await wait(2)
      }
    }

    for (const trend of trends) {
      logger.info(`Recommendation trend: ${symbol}`)

      trend.symbol = symbol

      promises.push(handleTrend(symbol, trend))
    }

    await Promise.all(promises)

    promises = []
  }
}

module.exports.updateRecommendationTrends = new CronJob('0 */4 * * *', async () => {
  logger.info('Running every 4 hours')

  try {
    await updateRecommendationTrends()
  } catch (err) {
    logger.error({ err }, 'Failed in updating recommendation trends')
  }

  logger.info('Done')
}, null, true, 'America/New_York');


// (async function () {
//   try {
//     await updateRecommendationTrends()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
