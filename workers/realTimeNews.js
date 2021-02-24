require('dotenv').config()

const EventSource = require('eventsource')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'real-time-news'

async function handleNews(newsArticle) {
  const exists = await db.NewsArticle.findOne({
    attributes: ['id'],
    where: {
      url: newsArticle.url,
    },
  })

  if (exists) {
    return
  }

  try {
    await db.NewsArticle.create({
      ...newsArticle,
      related: newsArticle.related ? newsArticle.related.split(',') : [],
    })

    logger.info({ processName }, 'Updated news')
  } catch (err) {
    logger.error({ processName, err }, 'Failed to update quote')
  }
}

const onOpen = event => {
  logger.info({ processName, event })
}

const onError = event => {
  logger.error({ processName, err: event })
}

const onResult = event => {
  logger.warn({ processName, warn: event })
}

const onMessage = event => {
  const data = JSON.parse(event.data)

  for (const newsArticle of data) {
    handleNews(newsArticle)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

function connect(joined) {
  const es = new EventSource(`https://cloud-sse.iexapis.com/stable/news-stream?symbols=${joined}&token=${process.env.IEX_CLOUD_TOKEN}`)

  es.addEventListener('open', onOpen)
  es.addEventListener('message', onMessage)
  es.addEventListener('error', onError)
  es.addEventListener('result', onResult)
}

module.exports = {
  start: async () => {
    let stopped = process.env.STOPPED === 'true'

    while (stopped) {
      logger.info({ processName }, 'Real time quote stopped')
      await wait(20)

      stopped = process.env.STOPPED === 'true'
    }

    const symbols = await db.StockSymbol.findAll({
      where: {
        // tracking: true,
        sectorId: {
          [db.sequelize.Op.ne]: null,
        },
      },
    })

    const arrayOfArrays = []
    const mapped = symbols.map(s => s.symbol)

    while (mapped.length) {
      arrayOfArrays.push(mapped.splice(0, 45))
    }

    for (const arr of arrayOfArrays) {
      connect(arr.join(','))
      await wait(2)
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
