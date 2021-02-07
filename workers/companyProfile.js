/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handleBasicFinancials(symbol, basicFinancials) {
  try {
    await db.CompanyProfile.update({ basicFinancials }, { where: { ticker: symbol } })
  } catch (err) {
    logger.error({ err }, 'Failed to update basic financials')
  }
}

async function updateCompanyProfile() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`Company profile: ${symbol}`)
    let profile

    while (!profile) {
      try {
        profile = await finhub.companyProfile({ symbol })
      } catch (err) {
        if (err.response && err.response.status === 401) {
          break
        }
        logger.error({ err }, `Failed to get company profile for ${symbol}`)
        await wait(2)
      }
    }

    if (!profile) {
      continue
    }

    // clean up
    for (const key of Object.keys(profile)) {
      profile[key] = profile[key] === '' ? null : profile[key]
    }

    profile.employeeTotal = profile.employeeTotal ? Number(profile.employeeTotal) : null
    profile.ticker = symbol

    const exists = await db.CompanyProfile.findOne({
      attributes: ['ticker'],
      where: { ticker: symbol },
    })

    if (exists) {
      try {
        await db.CompanyProfile.update(profile, { where: { ticker: symbol } })
      } catch (err) {
        logger.error({ err }, 'Failed to update company profile')
      }
    } else {
      try {
        await db.CompanyProfile.create(profile)
      } catch (err) {
        logger.error({ err }, 'Failed to store company profile')
      }
    }

    let basicFinancials

    while (!basicFinancials) {
      try {
        basicFinancials = await finhub.basicFinancials({ symbol })
      } catch (err) {
        logger.error({ err })
        await wait(2)
      }
    }

    await handleBasicFinancials(symbol, basicFinancials)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateCompanyProfile = new CronJob('0 17 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info('Running every 17:00 every day')

    try {
      await updateCompanyProfile()
    } catch (err) {
      logger.error({ err }, 'Failed in updating company profiles')
    }

    logger.info('Done')
  }

}, null, true, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateCompanyProfile()
    } catch (err) {
      logger.error({ err })
    }
  })()
}
