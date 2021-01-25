require('dotenv').config()

const EventSource = require('eventsource')
const db = require('../src/database')
const logger = require('../src/common/logger')

async function handleQuote(quote) {
  const exists = await db.Quote.findOne({
    attributes: ['symbol'],
    where: { symbol: quote.symbol.toUpperCase() },
  })

  if (exists) {
    try {
      await db.Quote.update(quote, { where: { symbol: quote.symbol.toUpperCase() } })
    } catch (err) {
      logger.error({ err })
    }

    return
  }

  try {
    await db.Quote.create(quote)
  } catch (err) {
    logger.error({ err })
  }
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

const onMessage = async event => {
  logger.info({ message: event })

  const data = JSON.parse(event.data)

  for (const quote of data) {
    handleQuote(quote)
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