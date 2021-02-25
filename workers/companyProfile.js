/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait, requestHelper } = require('../src/utils/helperFuncs')

const processName = 'company-profile'

async function handleBasicFinancials(symbol, basicFinancials) {
  try {
    await db.CompanyProfile.update({ basicFinancials }, { where: { ticker: symbol } })
  } catch (err) {
    logger.error({ processName, err }, 'Failed to update basic financials')
  }
}

async function updateCompanyProfile() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Company profile: ${symbol}`)
    const profile = await requestHelper(processName, () => finhub.companyProfile({ symbol }))

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
        logger.error({ processName, err }, 'Failed to update company profile')
      }
    } else {
      try {
        await db.CompanyProfile.create(profile)
      } catch (err) {
        logger.error({ processName, err }, 'Failed to store company profile')
      }
    }

    const basicFinancials = await requestHelper(processName, () => finhub.basicFinancials({ symbol }))

    if (!basicFinancials) {
      continue
    }

    handleBasicFinancials(symbol, basicFinancials)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateCompanyProfile = new CronJob('0 18 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every 18:00 every day')

    try {
      await updateCompanyProfile()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating company profiles')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateCompanyProfile()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
