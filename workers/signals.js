/* eslint-disable no-await-in-loop */
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')

/*
For a stock to display in this table it must meet 1 or more of the following criteria: 
(1) a new price target > 10% higher than the current price or 
(2) options activity with a strike price > 10% higher than the current price and Volume >= Open Interest OR
(3) positive fund ownership change > 5% or 
(4) Q / Q sales increase > 10% from last quarter or 
(5) Y / Y sales increase > 10% from last year or 
(6) Buzz index between 6 and 10 or  
(7) Buzz Ratio > 150% or
(8) Volume alert for any of the volume growth signals > 20%
(9) Buy + Strong Buy over Sell + Strong Sell Ratio changes + or - > 10% = for every signal we identify we capture the date and time for use in the report card. 
*/

let triggers = []

async function volumeTriger(symbol, quote) {
  const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
  const latestVolume = quote.latestVolume
  const yesterdaysVolume = await db.HistoricalPrice.findOne({
    where: {
      symbol,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), '=', yesterday),
      ],
    },
  })

  if (!yesterdaysVolume) {
    return null
  }

  const change = (Number(latestVolume) / Number(yesterdaysVolume.volume) - 1) * 100

  if (change > 20) {
    triggers.push('VOLUME')
  }

  return yesterdaysVolume.id
}

async function priceTargetSignal(symbol, quote) {
  const threeMonthsAgo = moment().subtract(90, 'days').format('YYYY-MM-DD')

  // add 10% to current price
  const targetPrice = quote.latestPrice * 1.1
  const priceTargets = await db.PriceTarget.findAll({
    where: {
      symbol,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '>=', threeMonthsAgo),
      ],
    },
    order: [
      ['lastUpdated', 'DESC'],
    ],
    limit: 3,
  })

  for (const priceTarget of priceTargets) {
    if (priceTarget.targetMean >= targetPrice) {
      triggers.push('PRICE_TARGET')
      break
    }
  }

  return priceTargets.map(p => p.id)
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

// async function buzzIndexSignal(symbol) {
//   let result = await db.sequelize.query(`
//     select id, weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end as buzz_index
//     from news_sentiment
//     where 
//       symbol = '${symbol}' 
//       AND
//       weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end > 6
//       AND
//       weekly_average / case when articles_in_last_week = 0 then null else articles_in_last_week end < 10
//     order by created_at desc
//     limit 1
// `)

//   let arr = result[0]
//   let newsSentiment = arr[0]

//   if (newsSentiment && newsSentiment.id) {
//     triggers.push('BUZZ_INDEX')
//     return newsSentiment.id
//   }

//   result = await db.sequelize.query(`
//     select id
//     from news_sentiment
//     where 
//       symbol = '${symbol}' 
//     order by created_at desc
//     limit 1
// `)

//   arr = result[0]
//   newsSentiment = arr[0]

//   return newsSentiment ? newsSentiment.id : null
// }

async function revenueGrowthQuarterlySignal(symbol) {
  const incomeStatements = await db.IncomeStatement.findAll({
    where: { symbol, freq: 'quarterly' },
    order: [
      ['period', 'DESC'],
    ],
    limit: 2,
  })

  if (incomeStatements.length !== 2) {
    return []
  }

  const first = incomeStatements[0]
  const second = incomeStatements[1]
  const delta = (Number(first.revenue) / Number(second.revenue)) - 1

  if (delta * 100 >= 10) {
    triggers.push('QUARTERLY_REVENUE_GROWTH')
  }

  return [first.id, second.id]
}

async function revenueGrowthYearlySignal(symbol) {
  const incomeStatements = await db.IncomeStatement.findAll({
    where: { symbol, freq: 'yearly' },
    order: [
      ['period', 'DESC'],
    ],
    limit: 2,
  })

  if (incomeStatements.length !== 2) {
    return []
  }

  const first = incomeStatements[0]
  const second = incomeStatements[1]
  const delta = (Number(first.revenue) / Number(second.revenue)) - 1

  if (delta * 100 >= 10) {
    triggers.push('YEARLY_REVENUE_GROWTH')
  }

  return [first.id, second.id]
}

async function fundOwnershipChange(symbol) {
  const fundOwnership = await db.EtfsAggregate.findAll({
    where: { symbol },
    order: [
      ['date', 'DESC'],
    ],
    limit: 2,
  })

  if (fundOwnership.length !== 2) {
    return []
  }

  const first = fundOwnership[0]
  const second = fundOwnership[1]
  const delta = (Number(first.totalShares) / Number(second.totalShares)) - 1

  if (delta * 100 >= 5) {
    triggers.push('ETFS_FUND_OWNERSHIP')
  }

  return [first.id, second.id]
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
    logger.info(`Looking for signal for symbol: ${symbol}`)
    triggers = []

    const quote = await db.Quote.findOne({
      where: { symbol },
    })

    if (!quote) {
      continue
    }

    const priceTargetIds = await priceTargetSignal(symbol, quote)
    const stockOptionId = await optionsActivitySignal(symbol, quote)
    const buzzRatioId = await buzzRatioSignal(symbol)
    // const buzzIndexId = await buzzIndexSignal(symbol) ignored for now
    const fundOwnershipIds = await fundOwnershipChange(symbol)
    const quarterlyRevenueIds = await revenueGrowthQuarterlySignal(symbol)
    const yearlyRevenueIds = await revenueGrowthYearlySignal(symbol)
    const signalHistoricalPriceId = await volumeTriger(symbol, quote)
    const recommendationTrendIds = await recommendationTrendSignal(symbol)

    if (triggers.length === 0) {
      continue
    }

    const exists = await db.Signal.findOne({
      attributes: ['id'],
      where: {
        symbol,
        stockOptionId,
        buzzRatioId,
        signalHistoricalPriceId,
        triggers,
      },
    })

    if (exists) {
      continue
    }

    const obj = await db.Signal.create({
      stockOptionId,
      buzzRatioId,
      symbol,
      signalHistoricalPriceId,
      signalQuote: quote.toJSON(),
      triggers,
    })

    await db.SignalRecommendationTrend.bulkCreate(recommendationTrendIds.map(r => {
      return {
        recommendationTrendId: r,
        signalId: obj.id,
      }
    }))

    await db.SignalPriceTarget.bulkCreate(priceTargetIds.map(r => {
      return {
        priceTargetId: r,
        signalId: obj.id,
      }
    }))

    await db.SignalEtfsAggregate.bulkCreate(fundOwnershipIds.map(r => {
      return {
        etfsAggregateId: r,
        signalId: obj.id,
      }
    }))

    await db.SignalIncomeStatement.bulkCreate([...quarterlyRevenueIds, ...yearlyRevenueIds].map(r => {
      return {
        incomeStatementId: r,
        signalId: obj.id,
      }
    }))
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

module.exports = {
  start: async () => {
    let stopped = process.env.STOPPED === 'true'

    while (stopped) {
      logger.info('Signals stopped')
      await wait(20)

      stopped = process.env.STOPPED === 'true'
    }

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

if (startImmediately) {
  module.exports.start()
}
