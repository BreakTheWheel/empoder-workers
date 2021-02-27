/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { requestHelper } = require('../src/utils/helperFuncs')
const stockNews = require('../src/services/stockNews')

const processName = 'stock-news-articles'

async function handleStockNewsArticle(article) {
  const exists = await db.StockNewsArticle.findOne({
    attributes: ['id'],
    where: { newsUrl: article.newsUrl },
  })

  if (!exists) {
    try {
      await db.StockNewsArticle.create(article)
    } catch (err) {
      logger.error({ err }, 'Failed to create stock news article')
    }
  }
}

async function updateStockNews() {
  const newsArticles = await requestHelper(processName, () => stockNews.allTickerNews())
  const articles = newsArticles.data.map(a => {
    return {
      ...a,
      imageUrl: a.image_url,
      newsUrl: a.news_url,
      sourceName: a.source_name,
      date: moment(a.date).toDate(),
    }
  })

  const promises = []

  for (const article of articles) {
    promises.push(handleStockNewsArticle(article))
  }

  await Promise.all(promises)

  logger.info({ processName }, 'Added bunch of articles')
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateStockNews = new CronJob('*/5 * * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every 5min')

    try {
      await updateStockNews()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating stock news')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateStockNews()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
