/* eslint-disable no-await-in-loop */
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait, requestHelper } = require('../src/utils/helperFuncs')
const iexCloud = require('../src/services/iexCloud')
const { exchanges } = require('../src/services/stockService')

const processName = 'delayed-quote'

async function handleDelayedQuote(quote) {
  const exists = await db.DelayedQuote.findOne({
    attributes: ['symbol'],
    where: {
      symbol: quote.symbol,
    },
  })

  try {
    if (!exists) {
      await db.DelayedQuote.create(quote)
    } else {
      await db.DelayedQuote.update(quote, { where: { symbol: quote.symbol } })
    }
  } catch (err) {
    logger.error({ processName }, 'Failed to update delayed quote')
  }
}

async function updateDelayedQuote() {
  // stocks that we are tracking but are not in the real-time prices table. OTC stocks
  const result = await db.sequelize.query(`
  SELECT * FROM ms_stock_symbols where sector_id is not null AND exchange_id in (${exchanges.map(e => `'${e}'`).join(',')}) and symbol NOT IN (
    SELECT symbol FROM quotes
  )
  `)

  const symbols = result[0]

  for (const symbol of symbols) {
    logger.info({ processName }, `Processing symbol: ${symbol.symbol}`)
    const delayedQuote = await requestHelper(processName, () => iexCloud.delayedQuote({ symbol: symbol.symbol }))

    if (!delayedQuote || Object.keys(delayedQuote).length === 0) {
      continue
    }

    handleDelayedQuote(delayedQuote)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

module.exports = {
  start: async () => {
    let stopped = process.env.STOPPED === 'true'

    while (stopped) {
      logger.info({ processName }, 'Delayed quote stopped')
      await wait(20)

      stopped = process.env.STOPPED === 'true'
    }

    while (true) {
      try {
        logger.info({ processName }, 'Started')
        await updateDelayedQuote()
        logger.info({ processName }, 'Done')

        await wait(350)
      } catch (err) {
        logger.error({ processName, err }, 'Failed in delayed quote')
      }
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
