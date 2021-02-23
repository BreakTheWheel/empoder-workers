/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const alphavantage = require('../src/services/alphavantage')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'currency-exchange'

async function updateCurrencyExchanges() {
  const result = await db.sequelize.query(`
    select currency from company_profiles where currency is not null group by currency
  `)
  const currencies = result[0]

  for (const currency of currencies) {
    logger.info({ processName }, `updateCurrencyExchanges Processing currency: ${currency.currency}`)

    const results = await alphavantage.exchangeRate({ fromCurrency: 'USD', toCurrency: currency.currency })
    const rate = results.data['Realtime Currency Exchange Rate']
    const exchangeRate = rate ? rate['5. Exchange Rate'] : null

    if (!exchangeRate) {
      continue
    }

    const exists = await db.CurrencyExchangeRate.findOne({
      where: {
        currency: currency.currency,
      },
    })

    const obj = {
      currency: currency.currency,
      exchangeRateToUsd: exchangeRate,
    }
    if (!exists) {
      await db.CurrencyExchangeRate.create(obj)
    } else {
      await db.CurrencyExchangeRate.update(obj, {
        where: { currency: currency.currency },
      })
    }

    logger.info({ processName, message: 'Done' })

    await wait(60)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateCurrencyExchanges = new CronJob('0 */1 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every hour')

    try {
      await updateCurrencyExchanges()
      logger.info('Done')
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating currency exchange')
    }
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateCurrencyExchanges()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
