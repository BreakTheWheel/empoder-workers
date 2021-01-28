require('dotenv').config()

const EventSource = require('eventsource')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')

async function handleQuote(query) {
  // const exists = await db.Quote.findOne({
  //   attributes: ['symbol'],
  //   where: { symbol: quote.symbol.toUpperCase() },
  // })

  // if (exists) {
  try {
    await db.sequelize.query(query)
  } catch (err) {
    logger.error({ err }, 'Failed to update quote')
  }

  //return
  //}

  // try {
  //   await db.Quote.create(quote)
  // } catch (err) {
  //   logger.error({ err }, 'Failed to create quote')
  // }
}

const onOpen = event => {
  logger.info({ event })
}

const onError = event => {
  logger.error({ err: event })
}

const onResult = event => {
  logger.warn({ warn: event })
}

let counter = 0
let query = ''
const maxlengh = 200

const onMessage = event => {
  const data = JSON.parse(event.data)

  for (const quote of data) {
    logger.info({ message: { symbol: quote.symbol, latestPrice: quote.latestPrice } })
    query += `
      UPDATE quotes 
      SET latest_price = ${quote.latestPrice}, volume = ${quote.volume}, close_source = '${quote.closeSource}', pe_ratio = ${quote.peRatio}, market_cap = ${quote.marketCap}
      WHERE symbol = '${quote.symbol}';
    `
    counter++
  }

  if (counter >= maxlengh) {
    handleQuote(query)
    query = ''
    counter = 0
  }
}

function connect(joined) {
  const es = new EventSource(`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP?symbols=${joined}&token=sk_3306b5dd12da4d5fb2baaa0cc5d076b8`);

  es.addEventListener('open', onOpen)
  es.addEventListener('message', onMessage)
  es.addEventListener('error', onError)
  es.addEventListener('result', onResult)
}

module.exports = {
  start: async () => {
    let stopped = process.env.STOPPED === 'true'
    while (stopped) {
      logger.info('Real time quote stopped')
      await wait(20)

      stopped = process.env.STOPPED === 'true'
    }

    const symbols = await db.StockSymbol.findAll({
      where: { tracking: true },
    })
    const arrayOfArrays = []
    const mapped = symbols.map(s => s.symbol)

    while (mapped.length) {
      arrayOfArrays.push(mapped.splice(0, 20))
    }

    for (const arr of arrayOfArrays) {
      connect(arr.join(','))
    }
  },
}

// module.exports.start()
