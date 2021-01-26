require('dotenv').config()

const { w3cwebsocket } = require('websocket')
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')

function storeTrades(trades) {
  db.Trade.bulkCreate(trades).catch(err => {
    logger.error({ err }, 'storing trades failed')
  })
}

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

// const symbols = [
//   'AAPL',
//   'TSLA',
//   'ROKU',
//   'NVTA',
//   'CRSP',
//   'SQ',
//   'TDOC',
//   'Z',
//   'SPOT',
//   'EDIT',
//   'SMG',
//   'CRLBF',
//   'GWPH',
//   'GRWG',
//   'TPB',
//   'GNLN',
//   'IIPR',
//   'TLRY',
//   'VFF',
//   'CGC',
//   'ACB',
//   'APHA',
//   'HEXO',
// ]

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
    logger.error({ err }, 'failed parsing data')
  }
}

function handleDailyVolume(obj) {
  try {
    let query = ''
    for (const trade of obj.data) {
      query += `
        INSERT INTO daily_volume (symbol, volume, date)
        VALUES('${trade.s}', ${trade.v}, '${moment.unix(trade.t / 1000).utc().format('YYYY-MM-DD')}') 
        ON CONFLICT (symbol, date) 
        DO  
          UPDATE SET volume = daily_volume.volume + ${trade.v};
    `
    }

    db.sequelize.query(query)
  } catch (err) {
    logger.error({ err }, 'failed parsing data')
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

    for (const sym of getSubscriptionRequests('subscribe', symbols)) {
      client.send(JSON.stringify(sym))
    }

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

    if (obj.type === 'trade') {
      handleTrade(obj)
    } else if (obj.type === 'news') {
      handleNews(obj)
    }
  }
}

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
