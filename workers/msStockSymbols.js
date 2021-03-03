/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')

const IN_PARALLEL = 500
const processName = 'ms-stock-symbols'

function escape(str) {
  if (str) {
    return str.replace(/'/g, '\'\'')
  }

  return ''
}

async function storeSymbol(query) {
  await db.sequelize.query(query)

  logger.info({ processName, message: 'Symbols stored' })
}

async function handleRegion(region) {
  const exists = await db.MsRegion.findOne({
    attributes: ['regionId'],
    where: { regionId: region.regionId },
  })

  if (!exists) {
    try {
      await db.MsRegion.create(region)
    } catch (err) {
      logger.error({ processName }, 'Failed to store ms region')
    }
  }
}

async function updateRegions(token) {
  const regions = await morningstar.regions({ token })

  const promises = []
  for (const region of regions.RegionEntityList) {
    promises.push(handleRegion({
      regionId: region.RegionId,
      regionName: region.RegionName,
    }))
  }

  await Promise.all(promises)
}

async function handleExchange(exchange) {
  const exists = await db.MsExchange.findOne({
    attributes: ['exchangeId'],
    where: { exchangeId: exchange.exchangeId },
  })

  if (!exists) {
    try {
      await db.MsExchange.create(exchange)
    } catch (err) {
      logger.error({ processName }, 'Failed to store ms exchange')
    }
  }
}

async function updateExchanges(token) {
  const regions = await db.MsRegion.findAll({
    where: {},
  })

  for (const region of regions) {
    const exchanges = await morningstar.exchanges({ regionId: region.regionId, token })
    const promises = []

    for (const exchange of exchanges.ExchangeEntityList) {
      promises.push(handleExchange({
        exchangeId: exchange.ExchangeId,
        mic: exchange.MIC,
        exchangeName: exchange.ExchangeName,
        regionId: exchange.RegionId,
        regionName: exchange.RegionName,
        countryId: exchange.CountryId,
        countryName: exchange.CountryName,
      }))
    }

    await Promise.all(promises)
  }
}

async function updateStockSymbols() {
  const exchanges = await db.MsExchange.findAll({
    attributes: ['exchangeId'],
    where: {},
  })

  let query = ''
  let counter = 0

  for (const exchange of exchanges) {
    logger.info({ processName, exchange: exchange.exchangeId })
    const symbols = await morningstar.stocks({ exchangeId: exchange.exchangeId })

    if (!symbols.StockExchangeSecurityEntityList) {
      logger.info({ processName, symbols }, 'No symbols for exchange')
      continue
    }

    for (const sym of symbols.StockExchangeSecurityEntityList) {
      if (!sym.Symbol) {
        continue
      }

      counter++
      query += `
      INSERT INTO ms_stock_symbols (symbol, company_name, exchange_id, cik, isin, sedol, cusip, investment_type_id, stock_status, par_value, suspended_flag, market_data_id, tracking, sector_id)
      VALUES(
        '${escape(sym.Symbol)}', 
        '${escape(sym.CompanyName)}', 
        '${sym.ExchangeId}', 
        '${escape(sym.CIK) || ''}', 
        '${escape(sym.ISIN) || ''}', 
        '${escape(sym.SEDOL) || ''}', 
        '${escape(sym.CUSIP) || ''}', 
        '${escape(sym.InvestmentTypeId) || ''}', 
        '${escape(sym.StockStatus) || ''}', 
        ${sym.ParValue ? escape(sym.ParValue) : null},
        ${sym.SuspendedFlag ? sym.SuspendedFlag : null},
        ${sym.MarketDataId ? `'${escape(sym.MarketDataId)}'` : null},
        false,
        null
      ) 
      ON CONFLICT (symbol) 
      DO  
        UPDATE SET stock_status = '${escape(sym.StockStatus) || ''}', company_name = '${escape(sym.CompanyName) || ''}';`

      if (counter === IN_PARALLEL) {
        await storeSymbol(query)
 
        counter = 0
        query = ''
      }
    }

    if (query) {
      await storeSymbol(query)

      counter = 0
      query = ''
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

async function go() {
  const token = await morningstar.login()
  await updateRegions(token)
  await updateExchanges(token)
  await updateStockSymbols(token)
}

module.exports.stockSymbols = new CronJob('0 11 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 11am')

    try {
      await go()
    } catch (err) {
      logger.error({ processName, err }, 'Failed to update stock symbols')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await go()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
