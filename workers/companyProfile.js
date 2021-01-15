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
        logger.error({ err }, `Failed to get company profile for ${symbol}`)
        await wait(2)
      }
    }

    // clean up
    for (const key of Object.keys(profile)) {
      profile[key] = profile[key] === '' ? null : profile[key]
    }

    profile.employeeTotal = profile.employeeTotal ? Number(profile.employeeTotal) : null
    profile.symbol = symbol

    const exists = await db.CompanyProfile.findOne({
      attributes: ['ticker'],
      where: { ticker: symbol },
    })

    if (exists) {
      try {
        await db.CompanyProfile.update(profile, { where: { ticker: symbol } })
      } catch (err) {
        logger.error({ err }, 'Failed to store company profile')
      }
    } else {
      try {
        await db.CompanyProfile.create(profile)
      } catch (err) {
        logger.error({ err }, 'Failed to store company profile')
      }
    }

    await wait(0.1)

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

module.exports.updateCompanyProfile = new CronJob('0 17 * * *', async () => {
  logger.info('Running every 17:00 every day')

  try {
    await updateCompanyProfile()
  } catch (err) {
    logger.error({ err }, 'Failed in updating company profiles')
  }

  logger.info('Done')
}, null, true, 'America/New_York');

// (async function () {
//   try {
//     await updateCompanyProfile()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()