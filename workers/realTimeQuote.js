require('dotenv').config()

const EventSource = require('eventsource')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')

async function handleQuote(query) {
  try {
    await db.sequelize.query(query)

    logger.info('Updated stock prices!')
  } catch (err) {
    logger.error({ err }, 'Failed to update quote')
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

let query = ''

const onMessage = event => {
  const data = JSON.parse(event.data)

  for (const quote of data) {
    logger.info({ message: { symbol: quote.symbol, latestPrice: quote.latestPrice, volume: quote.volume, latestVolume: quote.latestVolume } })
    query += `
    INSERT INTO quotes (
      symbol,
      avg_total_volume, 
      change, 
      change_percent, 
      close, 
      close_source, 
      close_time, 
      company_name, 
      delayed_price, 
      delayed_price_time, 
      extended_change, 
      extended_change_percent, 
      extended_price, 
      extended_price_time, 
      high, 
      high_source, 
      high_time, 
      last_trade_time, 
      latest_update, 
      latest_volume,
      low_time,
      market_cap,
      open_time,
      pe_ratio,
      previous_close,
      previous_volume,
      odd_lot_delayed_price_time,
      latest_price, 
      latest_source,
      latest_time,
      low,
      low_source,
      open,
      open_source,
      primary_exchange,
      volume,
      calculation_price
    )
    VALUES (
      '${quote.symbol}',
      ${quote.avgTotalVolume || null}, 
      ${quote.change || null}, 
      ${quote.changePercent || null}, 
      ${quote.close || null}, 
      '${quote.closeSource || null}', 
      ${quote.closeTime || null}, 
      '${quote.companyName || null}', 
      ${quote.deplayedPrice || null}, 
      ${quote.delayedPriceTime || null}, 
      ${quote.extendedChange || null}, 
      ${quote.extendedChangePercent || null}, 
      ${quote.extendedPrice || null}, 
      ${quote.extendedPriceTime || null}, 
      ${quote.high || null}, 
      '${quote.highSource || null}', 
      ${quote.highTime || null}, 
      ${quote.lastTradeTime || null}, 
      ${quote.latestUpdate || null}, 
      ${quote.latestVolume || null}, 
      ${quote.lowTime || null}, 
      ${quote.marketCap || null}, 
      ${quote.openTime || null}, 
      ${quote.peRatio || null}, 
      ${quote.previousClose || null}, 
      ${quote.previousVolume || null}, 
      ${quote.oddLotDelayedPrice || null}, 
      ${quote.latestPrice || null}, 
      '${quote.latestSource || null}', 
      '${quote.latestTime || null}', 
      ${quote.low || null}, 
      '${quote.lowSource || null}', 
      ${quote.open || null}, 
      '${quote.openSource || null}', 
      '${quote.primaryExchange || null}', 
      ${quote.volume || 0}, 
      '${quote.calculationPrice || null}'
    )
    ON CONFLICT (symbol)
    DO UPDATE 
    SET 
      avg_total_volume = ${quote.avgTotalVolume || null}, 
      change = ${quote.change || null}, 
      change_percent = ${quote.changePercent || null},
      close = ${quote.close || null},  
      close_source = '${quote.closeSource || null}', 
      close_time = ${quote.closeTime || null},
      company_name = '${quote.companyName || null}',
      delayed_price = ${quote.deplayedPrice || null},
      delayed_price_time = ${quote.delayedPriceTime || null},
      extended_change = ${quote.extendedChange || null},
      extended_change_percent = ${quote.extendedChangePercent || null},
      extended_price = ${quote.extendedPrice || null},
      extended_price_time = ${quote.extendedPriceTime || null},
      high = ${quote.high || null},
      high_source = '${quote.highSource || null}',
      high_time = ${quote.highTime || null},
      last_trade_time = ${quote.lastTradeTime || null},
      latest_update = ${quote.latestUpdate || null},
      latest_volume = ${quote.latestVolume || null},
      low_time = ${quote.lowTime || null},
      market_cap = ${quote.marketCap || null},
      open_time = ${quote.openTime || null},
      pe_ratio = ${quote.peRatio || null},
      previous_close = ${quote.previousClose || null},
      previous_volume = ${quote.previousVolume || null},
      odd_lot_delayed_price = ${quote.oddLotDelayedPrice || null},
      latest_price = ${quote.latestPrice || null},
      latest_source = '${quote.latestSource || null}',
      latest_time = '${quote.latestTime || null}',
      low = ${quote.low || null},
      low_source = '${quote.lowSource || null}',
      open = ${quote.open || null},
      open_source = '${quote.openSource || null}',
      primary_exchange = '${quote.primaryExchange || null}',
      volume = ${quote.volume || 0},
      calculation_price = '${quote.calculationPrice || null}';
    `
  }

  handleQuote(query)
  query = ''
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

function connect(joined) {
  const es = new EventSource(`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP?symbols=${joined}&token=${process.env.IEX_CLOUD_TOKEN}`);

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
      await wait(2)
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
