/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { requestHelper } = require('../src/utils/helperFuncs')

const processName = 'recommendation-trends'

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
    logger.error({ processName, err }, `Failed to store trend for symbol ${symbol}`)
  }
}

async function updateRecommendationTrends() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
    order: [
      ['sectorId', 'ASC'],
    ],
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Recommendation trend: ${symbol}`)

    const trends = await requestHelper(processName, () => finhub.recommendationTrends({ symbol }))

    if (!trends) {
      continue
    }

    for (const trend of trends) {
      trend.symbol = symbol

      promises.push(handleTrend(symbol, trend))
    }

    await Promise.all(promises)

    promises = []
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateRecommendationTrends = new CronJob('0 8 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running once a day at 8am')

    try {
      await updateRecommendationTrends()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating recommendation trends')
    }

    logger.info({ processName }, 'Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateRecommendationTrends()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
