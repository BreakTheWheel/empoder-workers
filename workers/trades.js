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

function storeNews(newsArticles) {
  db.NewsArticle.bulkCreate(newsArticles).catch(err => {
    logger.error({ err }, 'storing news failed')
  })
}

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

function getSymbols(subscriptionType) {
  const syms = [
    { type: subscriptionType, symbol: 'AAPL' },
    { type: subscriptionType, symbol: 'TSLA' },
    { type: subscriptionType, symbol: 'ROKU' },
    { type: subscriptionType, symbol: 'NVTA' },
    { type: subscriptionType, symbol: 'CRSP' },
    { type: subscriptionType, symbol: 'SQ' },
    { type: subscriptionType, symbol: 'TDOC' },
    { type: subscriptionType, symbol: 'Z' },
    { type: subscriptionType, symbol: 'SPOT' },
    { type: subscriptionType, symbol: 'EDIT' },
    { type: subscriptionType, symbol: 'SMG' },
    // { type: 'subscribe', symbol: 'CURLF' },
    // { type: 'subscribe', symbol: 'GTBIF' },
    { type: subscriptionType, symbol: 'CRLBF' },
    { type: subscriptionType, symbol: 'GWPH' },
    // { type: 'subscribe', symbol: 'TCNNF' },
    // { type: 'subscribe', symbol: 'HRVSF' },
    // { type: 'subscribe', symbol: 'TCNNF' },
    // { type: 'subscribe', symbol: 'HRVSF' },
    { type: subscriptionType, symbol: 'GRWG' },
    // { type: 'subscribe', symbol: 'CCHWF' },
    // { type: 'subscribe', symbol: 'AYRWF' },
    // { type: 'subscribe', symbol: 'TLLTF' },
    { type: subscriptionType, symbol: 'TPB' },
    { type: subscriptionType, symbol: 'GNLN' },
    // { type: 'subscribe', symbol: 'ITHUF' },
    // { type: 'subscribe', symbol: 'MMNFF' },
    { type: subscriptionType, symbol: 'IIPR' },
    // { type: 'subscribe', symbol: 'ACRGH' },
    { type: subscriptionType, symbol: 'TLRY' },
    // { type: 'subscribe', symbol: 'KSHB' },
    // { type: 'subscribe', symbol: 'CWBHF' },
    // { type: 'subscribe', symbol: 'JUSHF' },
    // { type: 'subscribe', symbol: 'PLNHF' },
    // { type: 'subscribe', symbol: 'HBORF' },
    { type: subscriptionType, symbol: 'VFF' },
    // { type: 'subscribe', symbol: 'CNTMF' },
    // { type: 'subscribe', symbol: 'INDXF' },
    // { type: 'subscribe', symbol: 'MRMD' },
    { type: subscriptionType, symbol: 'CGC' },
    { type: subscriptionType, symbol: 'ACB' },
    { type: subscriptionType, symbol: 'APHA' },
    // { type: 'subscribe', symbol: 'TRSSF' },
    // { type: 'subscribe', symbol: 'FFLWF' },
    { type: subscriptionType, symbol: 'HEXO' },
    // { type: 'subscribe', symbol: 'HITIF' },
    { type: subscriptionType, symbol: 'OGI' },
    // { type: 'subscribe', symbol: 'ZBISF' },
    // { type: 'subscribe', symbol: 'LHSIF' },
    // { type: 'subscribe', symbol: 'VLNCF' },
  ]

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


function handleNews(obj) {
  try {
    const news = obj.data.map(data => {
      return {
        category: data.category,
        datetime: data.datetime,
        headline: data.headline,
        id: data.id,
        image: data.image,
        related: data.related,
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

function connect() {
  client = new w3cwebsocket(`wss://ws.finnhub.io?token=${process.env.FIN_HUB_TOKEN}`)

  client.onerror = event => {
    logger.error({ event }, 'Connection error')
    client.close()
  }

  client.onopen = () => {
    logger.info('Socket opened')

    for (const sym of getSymbols('subsribe')) {
      client.send(JSON.stringify(sym))
    }

    for (const sym of getSymbols('subsribe-news')) {
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
    while (true) {
      const stopped = process.env.STOPPED === 'true'

      if (stopped) {
        logger.info('Stopped')
        await wait(20000)

        continue
      }

      if (!client) {
        connect()
      }

      await wait(1000)
    }
  },
}
