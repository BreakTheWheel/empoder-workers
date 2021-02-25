/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { requestHelper } = require('../src/utils/helperFuncs')

const IN_PARALLEL = 500
const processName = 'stock-symbols'

const exchanges = [
  'AT',
  'AX',
  'BA',
  'BC',
  'BD',
  'BE',
  'BK',
  'BO',
  'BR',
  'CN',
  'CO',
  'CR',
  'DB',
  'DE',
  'DU',
  'F',
  'HE',
  'HK',
  'HM',
  'IC',
  'IR',
  'IS',
  'JK',
  'JO',
  'KL',
  'KQ',
  'KS',
  'L',
  'LN',
  'LS',
  'MC',
  'ME',
  'MI',
  'MU',
  'MX',
  'NE',
  'NL',
  'NS',
  'NZ',
  'OL',
  'PA',
  'PM',
  'PR',
  'QA',
  'RG',
  'SA',
  'SG',
  'SI',
  'SN',
  'SR',
  'SS',
  'ST',
  'SW',
  'SZ',
  'T',
  'TA',
  'TL',
  'TO',
  'TW',
  'US',
  'V',
  'VI',
  'VN',
  'VS',
  'WA',
  'HA',
  'SX',
  'TG',
  'SC',
]

function escape(str) {
  if (str) {
    return str.replace(/'/g, '\'\'')
  }

  return ''
}

async function storeSymbol(query) {
  await db.sequelize.query(query)
}

async function updateStockSymbols(exchange) {
  const ex = exchange.trim().toLowerCase()
  const symbols = await requestHelper(processName, () => finhub.stockSymbols({ exchange: ex }))

  if (!symbols) {
    return
  }

  let query = ''
  let counter = 0

  for (const sym of symbols) {
    counter++
    query += `
    INSERT INTO stock_symbols (symbol, display_symbol, currency, type, description, exchange, tracking, sector_id)
    VALUES(
      '${sym.symbol}', 
      '${sym.display_symbol || ''}', 
      '${sym.currency || ''}', 
      '${sym.type || ''}', 
      '${escape(sym.description) || ''}', 
      '${ex}', 
      false,
      null
    ) 
    ON CONFLICT (symbol) 
    DO  
      UPDATE SET display_symbol = '${sym.display_symbol || ''}', currency = '${sym.currency || ''}', description = '${escape(sym.description) || ''}', exchange = '${ex}';
  `

    if (counter === IN_PARALLEL) {
      await storeSymbol(query)

      logger.info({ processName, message: 'Symbol stored' })

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

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.stockSymbols = new CronJob('0 11 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 11am')

    try {
      for (const exchange of exchanges) {
        await updateStockSymbols(exchange)
      }
    } catch (err) {
      logger.error({ processName, err }, 'Failed to update stock symbols')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      for (const exchange of exchanges) {
        logger.info({ processName, exchange })
        await updateStockSymbols(exchange)
      }
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
