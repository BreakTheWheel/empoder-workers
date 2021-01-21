/* eslint-disable no-await-in-loop */
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')

/*
For a stock to display in this table it must meet 1 or more of the following criteria: 
(1) a new price target > 10% higher than the current price or 
(2) options activity with a strike price > 10% higher than the current price or 
(3) positive fund ownership change > 5% or 
(4) Q / Q sales increase > 10% from last quarter or 
(5) Y / Y sales increase > 10% from last year or (6) Buzz index between 6 and 10 or  
(7) Buzz Ratio > 150% or
(8) Volume alert for any of the volume growth signals > 20%
*/

async function priceTargetSignal(symbol) {
  const today = moment().format('YYYY-MM-DD')
  const quote = await db.Quote.findOne({
    attributes: ['currentPrice'],
    where: { symbol },
  })

  // add 10% to current price
  const targetPrice = quote.currentPrice * 1.1
  const priceTarget = await db.PriceTarget.findOne({
    where: {
      symbol,
      targetMean: { [db.Sequelize.Op.gte]: targetPrice },
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '>=', today),
      ],
    },
    order: [
      ['lastUpdated', 'ASC'],
    ],
  })

  return priceTarget ? priceTarget.id : null
}

async function optionsActivitySignal(symbol) {
  const today = moment().format('YYYY-MM-DD')
  const quote = await db.Quote.findOne({
    attributes: ['currentPrice'],
    where: { symbol },
  })

  // add 10% to current price
  const targetPrice = quote.currentPrice * 1.1
  const stockOption = await db.StockOption.findOne({
    where: {
      symbol,
      strikePrice: { [db.Sequelize.Op.gte]: targetPrice },
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('expiration_date')), '>=', today),
      ],
    },
    order: [
      ['expirationDate', 'ASC'],
    ],
  })

  return stockOption ? stockOption.id : null
}


async function buzzIndexSignal(symbol) {
  const newsSentiment = await db.NewsSentiment.findOne({
    attributes: [
      'id',
      'buzz',
    ],
    where: {
      symbol,
      buzz: {
        [db.sequelize.Op.gte]: 1.5,
      },
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  })

  return newsSentiment ? newsSentiment.id : null
}

async function buzzRatioSignal(symbol) {
  const result = await db.sequelize.query(`
    select id, weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end as buzz_ratio 
    from news_sentiment
    where 
      symbol = '${symbol}' 
      AND
      weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end > 6
    order by created_at desc
    limit 1
`)

  const arr = result[0]
  const newsSentiment = arr[0]

  return newsSentiment ? newsSentiment.id : null
}

async function revenueGrowthQuarterlySignal(symbol) {
  const result = await db.sequelize.query(`
    select id, basic_financials->'metric'->'revenueGrowthQuarterlyYoy' 
    from company_basic_financials
    where 
    basic_financials->'metric'->'revenueGrowthQuarterlyYoy' <> 'null'
    AND
    (basic_financials->'metric'->'revenueGrowthQuarterlyYoy')::float > 10
    AND
    symbol = '${symbol}' 
  `)

  const arr = result[0]
  const obj = arr[0]

  return obj ? obj.id : null
}

async function revenueGrowthYearlySignal(symbol) {
  const result = await db.sequelize.query(`
    select id, basic_financials->'metric'->'revenueGrowthTTMYoy' 
    from company_basic_financials
    where basic_financials->'metric'->'revenueGrowthTTMYoy' <> 'null'
    AND
    (basic_financials->'metric'->'revenueGrowthTTMYoy')::float > 10
    AND
    symbol = '${symbol}'  
  `)

  const arr = result[0]
  const obj = arr[0]

  return obj ? obj.id : null
}

async function fundOwnershipChange(symbol) {
  const fundOwnership = await db.sequelize.query(`
  select * from
  (
    select 
    *,
    (change / (share - change)) * 100 as percentage_change 
    from fund_ownership where change <> 0 and share <> change
  ) as x
  where percentage_change > 10 AND symbol = '${symbol}'
  order by filing_date desc
  limit 1
  `)

  const arr = fundOwnership[0]
  const obj = arr[0]

  return obj ? obj.id : null
}

async function updateSignals() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`quote: ${symbol}`)

    const priceTargetId = await priceTargetSignal(symbol)
    const stockOptionId = await optionsActivitySignal(symbol)
    const buzzRatioId = await buzzRatioSignal(symbol)
    const buzzIndexId = await buzzIndexSignal(symbol)
    const fundOwnershipId = await fundOwnershipChange(symbol)
    const quarterlyRevenueId = await revenueGrowthQuarterlySignal(symbol)
    const yearlyRevenueId = await revenueGrowthYearlySignal(symbol)

    if ([priceTargetId, stockOptionId, buzzRatioId, fundOwnershipId, buzzIndexId, quarterlyRevenueId, yearlyRevenueId].some(c => c)) {
      const exists = await db.Signal.findOne({
        attributes: ['id'],
        where: {
          symbol,
          priceTargetId,
          stockOptionId,
          buzzRatioId,
          buzzIndexId,
          fundOwnershipId,
          quarterlyRevenueId,
          yearlyRevenueId,
        },
      })

      if (exists) {
        continue
      }

      await db.Signal.create({
        priceTargetId,
        stockOptionId,
        buzzRatioId,
        symbol,
        buzzIndexId,
        fundOwnershipId,
        quarterlyRevenueId,
        yearlyRevenueId,
      })
    }
  }
}

module.exports = {
  start: async () => {
    while (true) {
      try {
        await updateSignals()

        logger.info('Done')
      } catch (err) {
        logger.error({ err }, 'Failed in signals')
      }
    }
  },
}
