/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'news-sentiment'

async function handleSentiment(symbol, sentiment) {
  try {
    const dbObj = await db.NewsSentiment.findOne({
      attributes: ['id', 'articlesInLastWeek'],
      where: { symbol },
      order: [
        ['createdAt', 'DESC'],
      ],
    })

    const buzz = sentiment.buzz

    if (!buzz) {
      return
    }

    const obj = {
      symbol,
      articlesInLastWeek: buzz.articlesInLastWeek,
      buzz: buzz.buzz,
      weeklyAverage: buzz.weeklyAverage,
      companyNewsScore: sentiment.companyNewsScore,
      sectorAverageBullishPercent: sentiment.sectorAverageBullishPercent,
      sectorAverageNewsScore: sentiment.sectorAverageNewsScore,
      bearishPercent: sentiment.sentiment ? sentiment.sentiment.bearishPercent : null,
      bullishPercent: sentiment.sentiment ? sentiment.sentiment.bullishPercent : null,
    }

    if (!dbObj) {
      await db.NewsSentiment.create(obj)
      return
    }

    // if the week was restarted
    if (dbObj.articlesInLastWeek > buzz.articlesInLastWeek) {
      await db.NewsSentiment.create(obj)
    } else if (dbObj.articlesInLastWeek < buzz.articlesInLastWeek) {
      await db.NewsSentiment.update(obj, { where: { id: dbObj.id } })
    }
  } catch (err) {
    logger.error({ processName, err }, 'Failed in handleSentiment')
  }
}

async function updateNewsSentiment() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`news sentiment: ${symbol}`)

    let newsSentiment

    while (!newsSentiment) {
      try {
        newsSentiment = await finhub.newsSentiment({ symbol })
      } catch (err) {
        logger.error({ processName, err }, 'Failed to get news sentiment')
        if (err.response && err.response.status === 401) {
          break
        }
        await wait(2)
      }
    }

    handleSentiment(symbol, newsSentiment)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateNewsSentiment = new CronJob('0 */5 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every 5 hours')

    try {
      await updateNewsSentiment()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating news sentiment')
    }

    logger.info({ processName }, 'Done')
  }
}, null, false, 'America/Los_Angeles');

if (startImmediately) {
  (async function () {
    try {
      await updateNewsSentiment()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
