/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handleBasicFinancials(symbol, basicFinancials) {
  if (!basicFinancials.metric || Object.keys(basicFinancials.metric).length === 0) {
    return
  }

  const result = await db.sequelize.query(`
  select id, basic_financials->'metric'->'revenueGrowthQuarterlyYoy' 
  from company_basic_financials
  where 
      basic_financials->'metric'->'revenueGrowthQuarterlyYoy' <> 'null' 
      AND
      (basic_financials->'metric'->'revenueGrowthQuarterlyYoy')::float = ${basicFinancials.metric.revenueGrowthQuarterlyYoy}
      AND 
      basic_financials->'metric'->'revenueGrowthTTMYoy' <> 'null' 
      AND
      (basic_financials->'metric'->'revenueGrowthTTMYoy')::float = ${basicFinancials.metric.revenueGrowthTTMYoy}
  `)

  const arr = result[0]
  const exists = arr[0]

  if (exists) {
    return
  }

  try {
    await db.CompanyBasicFinancial.create({
      symbol,
      basicFinancials,
    })
  } catch (err) {
    logger.error({ err }, 'Failed to update basic financials')
  }
}

async function updateBasicFinancials() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`Basic financials: ${symbol}`)
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

module.exports.updateCompanyProfile = new CronJob('0 18 * * *', async () => {
  logger.info('Running every 18:00 every day')

  try {
    await updateBasicFinancials()
  } catch (err) {
    logger.error({ err }, 'Failed in updating company basic financials')
  }

  logger.info('Done')
}, null, true, 'America/New_York');

// (async function () {
//   try {
//     await updateBasicFinancials()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()