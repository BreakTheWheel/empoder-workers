/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')

const processName = 'ms-symbols-guide'

async function handleItem(item) {
  const exists = await db.MsSymbolsGuide.findOne({
    attributes: ['symbol'],
    where: {
      symbol: item.H1,
      exchangeCode: item.S676,
    },
  })

  if (exists) {
    try {
      await db.MsSymbolsGuide.update(item, {
        where: {
          symbol: item.H1,
          exchangeCode: item.S676,
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsSymbolsGuide option')
    }
  } else {
    try {
      await db.MsSymbolsGuide.create({
        exchange: item.H2,
        securityType: item.H3,
        symbol: item.H1,
        companyName: item.S12,
        tradedCurrency: item.D204,
        listedCurrency: item.S9,
        msPerformanceId: item.D2124,
        country: item.S34,
        exchangeCode: item.S676,
        rootCode: item.S2,
        originalExchangeCode: item.S3069,
        localInstrumentCode: item.S33,
        sedol: item.S1013,
        companyInfo: item.S13,
        fundType: item.S3076,
        figiCode: item.D2995,
        figiCountryCode: item.S1405,
        isin: item.S19,
        cusip: item.S1012,
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsSymbolsGuide option')
    }
  }
}

async function symbolsGuide() {
  for (let i = 1; i <= 250; i++) {
    const symbols = await requestHelper(processName, () => morningstar.symbolsGuide({
      exchangeId: i,
    }))

    if (!symbols || !symbols.quotes.results) {
      continue
    }

    let promises = []

    for (const symbol of symbols.quotes.results) {
      promises.push(handleItem(symbol))

      if (promises.length === 500) {
        await Promise.all(promises)

        promises = []

        logger.info({ processName }, 'Batch saved')
      }
    }

    await Promise.all(promises)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.symbolsGuide = new CronJob('0 3 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 3am')

    try {
      await symbolsGuide()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating symbols guide')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await symbolsGuide()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
