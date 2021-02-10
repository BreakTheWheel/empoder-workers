/* eslint-disable no-await-in-loop */
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')
const iexCloud = require('../src/services/iexCloud')

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
    SELECT * FROM stock_symbols where tracking = true and symbol NOT IN (
      SELECT symbol FROM quotes
    )
  `)

  const symbols = result[0]

  for (const symbol of symbols) {
    let delayedQuote

    while (!delayedQuote) {
      try {
        delayedQuote = await iexCloud.delayedQuote({ symbol: symbol.symbol })
      } catch (err) {
        if (err.response && err.response.data === 'Not found') { // symbol does not exist
          logger.error({ processName }, `Symbol ${symbol} not found in IEX`)
          break
        }

        logger.error({ processName, err }, 'Failed on IEX delayed quote')
        await wait(2)
      }
    }

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
      } catch (err) {
        logger.error({ processName, err }, 'Failed in delayed quote')
      }
    }
  },
}

if (startImmediately) {
  module.exports.start()
}
