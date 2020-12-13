require('dotenv').config()
const { w3cwebsocket } = require('websocket')
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')

const client = new w3cwebsocket(`wss://ws.finnhub.io?token=${process.env.FIN_HUB_TOKEN}`)

async function storeTrade(trade) {
  try {
    await db.Trade.create(trade)
  } catch (err) {
    logger.error({ err }, 'storing trade failed')
  }
}

module.exports = {
  start: () => {
    client.onerror = event => {
      logger.error({ event }, 'Connection error')
    }

    client.onopen = () => {
      logger.info('Socket opened')
      client.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }))
      client.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:ETHUSDT' }))
    }

    client.onclose = event => {
      logger.error({ event }, 'Connection closed')
    }

    client.onmessage = event => {
      logger.info(event.data, 'incoming trade')

      const obj = JSON.parse(event.data)

      try {
        const data = obj.data[0]

        storeTrade({
          symbol: data.s,
          price: data.p,
          timestamp: moment.unix(data.t / 1000).utc().toDate(),
          unixTimestampMs: data.t,
          volume: data.v,
        })
      } catch (err) {
        logger.error({ err }, 'failed parsing data')
      }
    }
  },
}
