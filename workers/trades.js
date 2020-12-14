require('dotenv').config()
const { w3cwebsocket } = require('websocket')
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const Promise = require('bluebird')

async function storeTrade(trade) {
  try {
    await db.Trade.create(trade)
  } catch (err) {
    logger.error({ err }, 'storing trade failed')
  }
}

const stopped = process.env.STOPPED === 'true'

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}


function connect() {
  // if (stopped) {
  //   await wait()

  //   connect()
  // }

  const client = new w3cwebsocket(`wss://ws.finnhub.io?token=${process.env.FIN_HUB_TOKEN}`)

  client.onerror = event => {
    logger.error({ event }, 'Connection error')

    setTimeout(() => {
      logger.warn('Reconnecting after error')
      connect()
    }, 500)
  }

  client.onopen = () => {
    logger.info('Socket opened')
    client.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }))
  }

  client.onclose = event => {
    logger.error({ event }, 'Connection closed')

    setTimeout(() => {
      logger.warn('Reconnecting after closing connection')
      connect()
    }, 500)
  }

  client.onmessage = event => {
    const obj = JSON.parse(event.data)

    logger.info({ data: obj }, 'incoming trade')

    try {
      const data = obj.data[0]

      storeTrade({
        symbol: data.s,
        price: data.p,
        timestamp: moment.unix(data.t / 1000).utc().toDate(),
        unixTimestampMs: data.t,
        volume: data.v,
        conditions: data.c,
      })
    } catch (err) {
      logger.error({ err }, 'failed parsing data')
    }
  }
}

module.exports = {
  start: () => {
    logger.info('Starting worker')
    connect()
  },
}
