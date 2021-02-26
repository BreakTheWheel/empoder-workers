require('dotenv').config()

const { w3cwebsocket } = require('websocket')
const LanguageDetect = require('languagedetect')
const db = require('../src/database')
const logger = require('../src/common/logger')

const lngDetector = new LanguageDetect()

async function storeNews(newsArticles) {
  try {
    await db.NewsArticle.bulkCreate(newsArticles)
  } catch (err) {
    logger.error({ err }, 'storing news failed')
  }
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

function getSubscriptionRequests(subscriptionType, symbols) {
  const syms = symbols.map(symbol => {
    return {
      type: subscriptionType, symbol,
    }
  })

  return syms
}

function handleNews(obj) {
  try {
    const news = obj.data.map(data => {
      const language = lngDetector.detect(`${data.headline} ${data.summary}`, 1)

      return {
        datetime: data.datetime,
        headline: data.headline,
        image: data.image,
        related: data.related ? data.related.split(',') : [],
        source: data.source,
        summary: data.summary,
        url: data.url,
        lang: language[0] && language[0][0] ? language[0][0] : null,
      }
    })

    storeNews(news)
  } catch (err) {
    logger.error({ err }, 'failed parsing data')
  }
}


let client

function connect(symbols) {
  client = new w3cwebsocket(`wss://ws.finnhub.io?token=${process.env.FIN_HUB_TOKEN}`)

  client.onerror = event => {
    logger.error({ event }, 'Connection error')
    client.close()
  }

  client.onopen = () => {
    logger.info('Socket opened')

    for (const sym of getSubscriptionRequests('subscribe-news', symbols)) {
      client.send(JSON.stringify(sym))
    }
  }

  client.onclose = event => {
    logger.error({ event }, 'Connection closed')

    client = null
  }

  client.onmessage = event => {
    const obj = JSON.parse(event.data)

    logger.info({ event: obj }, 'incoming event')

    if (obj.type !== 'ping') {
      handleNews(obj)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

module.exports = {
  start: async () => {
    const stockSymbols = await db.StockSymbol.findAll({
      attributes: ['symbol'],
      where: {
        sectorId: { [db.sequelize.Op.ne]: null },
      },
    })

    const symbols = stockSymbols.map(s => s.symbol)

    while (true) {
      const stopped = process.env.STOPPED === 'true'

      if (stopped) {
        logger.info('Stopped')
        await wait(20000)

        continue
      }

      if (!client) {
        connect(symbols)
      }

      await wait(2000)
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
