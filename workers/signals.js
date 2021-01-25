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
(9) Buy + Strong Buy over Sell + Strong Sell Ratio changes + or - > 10% = for every signal we identify we capture the date and time for use in the report card. 
*/

let triggers = []

async function priceTargetSignal(symbol, quote) {
  const today = moment().format('YYYY-MM-DD')

  // add 10% to current price
  const targetPrice = quote.latestPrice * 1.1
  let priceTarget = await db.PriceTarget.findOne({
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

  if (priceTarget && priceTarget.id) {
    triggers.push('PRICE_TARGET')
    return priceTarget.id
  }

  priceTarget = await db.PriceTarget.findOne({
    where: {
      symbol,
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

async function optionsActivitySignal(symbol, quote) {
  const today = moment().format('YYYY-MM-DD')

  // add 10% to current price
  const strikePrice = quote.latestPrice * 1.1
  let stockOption = await db.StockOption.findOne({
    where: {
      symbol,
      strikePrice: { [db.Sequelize.Op.gte]: strikePrice },
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('expiration_date')), '>=', today),
        db.sequelize.where(db.sequelize.col('volume'), '>=', db.sequelize.col('open_interest')),
      ],
    },
    order: [
      ['expirationDate', 'ASC'],
    ],
  })

  if (stockOption && stockOption.id) {
    triggers.push('STOCK_OPTION')
    return stockOption.id
  }

  stockOption = await db.StockOption.findOne({
    where: {
      symbol,
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

async function buzzRatioSignal(symbol) {
  let newsSentiment = await db.NewsSentiment.findOne({
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

  if (newsSentiment && newsSentiment.id) {
    triggers.push('BUZZ_RATIO')
    return newsSentiment.id
  }

  newsSentiment = await db.NewsSentiment.findOne({
    attributes: [
      'id',
      'buzz',
    ],
    where: {
      symbol,
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  })

  return newsSentiment ? newsSentiment.id : null
}

async function buzzIndexSignal(symbol) {
  let result = await db.sequelize.query(`
    select id, weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end as buzz_index
    from news_sentiment
    where 
      symbol = '${symbol}' 
      AND
      weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end > 6
      AND
      weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end < 10
    order by created_at desc
    limit 1
`)

  let arr = result[0]
  let newsSentiment = arr[0]

  if (newsSentiment && newsSentiment.id) {
    triggers.push('BUZZ_INDEX')
    return newsSentiment.id
  }

  result = await db.sequelize.query(`
    select id
    from news_sentiment
    where 
      symbol = '${symbol}' 
    order by created_at desc
    limit 1
`)

  arr = result[0]
  newsSentiment = arr[0]

  return newsSentiment ? newsSentiment.id : null
}

async function revenueGrowthQuarterlySignal(symbol) {
  const basicFinancial = await db.CompanyBasicFinancial.findOne({
    where: { symbol },
    order: [
      ['createdAt', 'DESC'],
    ],
  })

  if (basicFinancial && basicFinancial.basicFinancials.metric && basicFinancial.basicFinancials.metric.revenueGrowthQuarterlyYoy) {
    if (basicFinancial.basicFinancials.metric.revenueGrowthQuarterlyYoy > 10) {
      triggers.push('QUARTERLY_REVENUE_GROWTH')
      return basicFinancial.id
    }
  }

  return basicFinancial ? basicFinancial.id : null
}

async function revenueGrowthYearlySignal(symbol) {
  const basicFinancial = await db.CompanyBasicFinancial.findOne({
    where: { symbol },
    order: [
      ['createdAt', 'DESC'],
    ],
  })

  if (basicFinancial && basicFinancial.basicFinancials.metric && basicFinancial.basicFinancials.metric.revenueGrowthTTMYoy) {
    if (basicFinancial.basicFinancials.metric.revenueGrowthTTMYoy > 10) {
      triggers.push('YEARLY_REVENUE_GROWTH')
      return basicFinancial.id
    }
  }

  return basicFinancial ? basicFinancial.id : null
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

async function recommendationTrendSignal(symbol) {
  const recommendationTrends = await db.RecommendationTrend.findAll({
    where: { symbol },
    limit: 2,
    order: [
      ['period', 'DESC'],
    ],
  })

  if (recommendationTrends[0] && recommendationTrends[1]) {
    const first = recommendationTrends[0]
    const second = recommendationTrends[1]

    const ratioOne = (first.buy + first.strongBuy) / (first.sell + first.strongSell)
    const ratioTwo = (second.buy + second.strongBuy) / (second.sell + second.strongSell)

    const change = (ratioOne / ratioTwo) - 1

    if (change >= 10) {
      triggers.push('RECOMMENDATION_TREND')
    }
  }

  return recommendationTrends.map(r => r.id)
}

async function updateSignals() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`Symbol: ${symbol}`)
    triggers = []

    const quote = await db.Quote.findOne({
      where: { symbol },
    })

    const priceTargetId = await priceTargetSignal(symbol, quote)
    const stockOptionId = await optionsActivitySignal(symbol, quote)
    const buzzRatioId = await buzzRatioSignal(symbol)
    const buzzIndexId = await buzzIndexSignal(symbol)
    const fundOwnershipId = await fundOwnershipChange(symbol)
    const quarterlyRevenueId = await revenueGrowthQuarterlySignal(symbol)
    const yearlyRevenueId = await revenueGrowthYearlySignal(symbol)
    const recommendationTrendIds = await recommendationTrendSignal(symbol)

    if (triggers.length === 0) {
      continue
    }

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
          triggers,
        },
      })

      if (exists) {
        continue
      }

      const obj = await db.Signal.create({
        priceTargetId,
        stockOptionId,
        buzzRatioId,
        symbol,
        buzzIndexId,
        fundOwnershipId,
        quarterlyRevenueId,
        yearlyRevenueId,
        signalQuote: quote.toJSON(),
        triggers,
      })

      await db.SignalRecommendationTrend.bulkCreate(recommendationTrendIds.map(r => {
        return {
          recommendationTrendId: r,
          signalId: obj.id,
        }
      }))
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
      triggers = []
    }
  },
}

module.exports.start()