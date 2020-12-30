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

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

function getSymbols() {
  const syms = [
    { type: 'subscribe', symbol: 'AAPL' },
    { type: 'subscribe', symbol: 'TSLA' },
    { type: 'subscribe', symbol: 'ROKU' },
    { type: 'subscribe', symbol: 'NVTA' },
    { type: 'subscribe', symbol: 'CRSP' },
    { type: 'subscribe', symbol: 'SQ' },
    { type: 'subscribe', symbol: 'TDOC' },
    { type: 'subscribe', symbol: 'Z' },
    { type: 'subscribe', symbol: 'SPOT' },
    { type: 'subscribe', symbol: 'EDIT' },
    { type: 'subscribe', symbol: 'SMG' },
    // { type: 'subscribe', symbol: 'CURLF' },
    // { type: 'subscribe', symbol: 'GTBIF' },
    { type: 'subscribe', symbol: 'CRLBF' },
    { type: 'subscribe', symbol: 'GWPH' },
    // { type: 'subscribe', symbol: 'TCNNF' },
    // { type: 'subscribe', symbol: 'HRVSF' },
    // { type: 'subscribe', symbol: 'TCNNF' },
    // { type: 'subscribe', symbol: 'HRVSF' },
    { type: 'subscribe', symbol: 'GRWG' },
    // { type: 'subscribe', symbol: 'CCHWF' },
    // { type: 'subscribe', symbol: 'AYRWF' },
    // { type: 'subscribe', symbol: 'TLLTF' },
    { type: 'subscribe', symbol: 'TPB' },
    { type: 'subscribe', symbol: 'GNLN' },
    // { type: 'subscribe', symbol: 'ITHUF' },
    // { type: 'subscribe', symbol: 'MMNFF' },
    { type: 'subscribe', symbol: 'IIPR' },
    // { type: 'subscribe', symbol: 'ACRGH' },
    { type: 'subscribe', symbol: 'TLRY' },
    // { type: 'subscribe', symbol: 'KSHB' },
    // { type: 'subscribe', symbol: 'CWBHF' },
    // { type: 'subscribe', symbol: 'JUSHF' },
    // { type: 'subscribe', symbol: 'PLNHF' },
    // { type: 'subscribe', symbol: 'HBORF' },
    { type: 'subscribe', symbol: 'VFF' },
    // { type: 'subscribe', symbol: 'CNTMF' },
    // { type: 'subscribe', symbol: 'INDXF' },
    // { type: 'subscribe', symbol: 'MRMD' },
    { type: 'subscribe', symbol: 'CGC' },
    { type: 'subscribe', symbol: 'ACB' },
    { type: 'subscribe', symbol: 'APHA' },
    // { type: 'subscribe', symbol: 'TRSSF' },
    // { type: 'subscribe', symbol: 'FFLWF' },
    { type: 'subscribe', symbol: 'HEXO' },
    // { type: 'subscribe', symbol: 'HITIF' },
    { type: 'subscribe', symbol: 'OGI' },
    // { type: 'subscribe', symbol: 'ZBISF' },
    // { type: 'subscribe', symbol: 'LHSIF' },
    // { type: 'subscribe', symbol: 'VLNCF' },
  ]

  return syms
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

    for (const sym of getSymbols()) {
      client.send(JSON.stringify(sym))
    }
  }

  client.onclose = event => {
    logger.error({ event }, 'Connection closed')

    client = null
  }

  client.onmessage = event => {
    const obj = JSON.parse(event.data)

    logger.info({ data: obj }, 'incoming trade')

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
