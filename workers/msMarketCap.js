/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-market-cap'

async function handleMarketCap(symbol, cap) {
  const exists = await db.MsMarketCap.findOne({
    where: {
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('market_cap_date')), '=', cap.MarketCapDate || db.sequelize.fn('date', db.sequelize.col('market_cap_date'))),
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('shares_date')), '=', cap.SharesDate || db.sequelize.fn('date', db.sequelize.col('shares_date'))),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(cap)) {
    obj[camelCase(key)] = cap[key]
  }

  if (exists) {
    try {
      await db.MsMarketCap.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('market_cap_date')), '=', cap.MarketCapDate || db.sequelize.fn('date', db.sequelize.col('market_cap_date'))),
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('shares_date')), '=', cap.SharesDate || db.sequelize.fn('date', db.sequelize.col('shares_date'))),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsMarketCap option')
    }
  } else {
    try {
      await db.MsMarketCap.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsMarketCap option')
    }
  }
}

async function updateMarketCap() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    const marketCap = await requestHelper(processName, () => morningstar.marketCap({
      token,
      exchangeId: symbol.exchangeId,
      symbol: symbol.symbol,
    }))

    if (!marketCap || !marketCap.MarketCapitalizationEntityList || Object.keys(marketCap.MarketCapitalizationEntityList).length === 0) {
      continue
    }

    for (const cap of marketCap.MarketCapitalizationEntityList) {
      await handleMarketCap(symbol, cap)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateMarketCap = new CronJob('0 22 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 10pm')

    try {
      await updateMarketCap()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating market cap')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateMarketCap()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
