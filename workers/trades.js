require('dotenv').config()

const { w3cwebsocket } = require('websocket')
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')

const processName = 'news'

function storeTrades(trades) {
  db.Trade.bulkCreate(trades).catch(err => {
    logger.error({ processName, err }, 'storing trades failed')
  })
}

async function storeNews(newsArticles) {
  try {
    await db.NewsArticle.bulkCreate(newsArticles)
  } catch (err) {
    logger.error({ processName, err }, 'storing news failed')
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

function handleTrade(obj) {
  try {
    const trades = obj.data.map(data => {
      return {
        symbol: data.s,
        price: data.p,
        timestamp: moment.unix(data.t / 1000).utc().toDate(),
        unixTimestampMs: data.t,
        volume: data.v,
        conditions: data.c,
      }
    })

    storeTrades(trades)
  } catch (err) {
    logger.error({ processName, err }, 'failed parsing data')
  }
}

function handleNews(obj) {
  try {
    const news = obj.data.map(data => {
      return {
        category: data.category,
        datetime: data.datetime,
        headline: data.headline,
        newsId: data.id,
        image: data.image,
        related: data.related ? data.related.split(',') : [],
        source: data.source,
        summary: data.summary,
        url: data.url,
      }
    })

    storeNews(news)
  } catch (err) {
    logger.error({ processName, err }, 'failed parsing data')
  }
}


let client

function connect(symbols) {
  client = new w3cwebsocket(`wss://ws.finnhub.io?token=${process.env.FIN_HUB_TOKEN}`)

  client.onerror = event => {
    logger.error({ processName, event }, 'Connection error')
    client.close()
  }

  client.onopen = () => {
    logger.info('Socket opened')

    // for (const sym of getSubscriptionRequests('subscribe', symbols)) {
    //   client.send(JSON.stringify(sym))
    // }

    for (const sym of getSubscriptionRequests('subscribe-news', symbols)) {
      client.send(JSON.stringify(sym))
    }
  }

  client.onclose = event => {
    logger.error({ processName, event }, 'Connection closed')

    client = null
  }

  client.onmessage = event => {
    const obj = JSON.parse(event.data)

    logger.info({ processName, event: obj }, 'incoming event')

    if (obj.type === 'trade') {
      handleTrade(obj)
    } else if (obj.type === 'news') {
      handleNews(obj)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

module.exports = {
  start: async () => {
    const stockSymbols = await db.StockSymbol.findAll({
      attributes: ['symbol'],
      where: { tracking: true },
    })

    const symbols = stockSymbols.map(s => s.symbol)

    while (true) {
      const stopped = process.env.STOPPED === 'true'

      if (stopped) {
        logger.info({ processName }, 'Stopped')
        await wait(20000)

        continue
      }

      if (!client) {
        connect(symbols)
      }

      await wait(3000)
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
