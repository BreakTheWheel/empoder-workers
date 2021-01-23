/* eslint-disable no-await-in-loop */
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')
const moment = require('moment')

// OBSOLETE

async function handleQuote(quote) {
  const exists = await db.Quote.findOne({
    attributes: ['symbol'],
    where: { symbol: quote.symbol },
  })

  if (exists) {
    await db.Quote.update(quote, { where: { symbol: quote.symbol } })
  } else {
    await db.Quote.create(quote)
  }
}

async function updateQuote() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`quote: ${symbol}`)

    let quote

    while (!quote) {
      try {
        quote = await await finhub.quote({ symbol })
      } catch (err) {
        logger.error({ err }, 'Failed to retrieve quote')
        await wait(2)
      }
    }

    quote.symbol = symbol

    await handleQuote(quote)
    await wait(0.2)
  }
}

module.exports = {
  start: async () => {
    while (true) {
      const now = moment().tz('America/New_York')
      const hour = now.hour()

      if (hour > 17 || hour < 8) {
        logger.info('Waiting...')
        await wait(10)
      }

      try {
        await updateQuote()
      } catch (err) {
        logger.error({ err }, 'Failed in updating quote')
      }
    }
  },
}
