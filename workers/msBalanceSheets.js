/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const moment = require('moment')
const db = require('../src/database')
const { requestHelper } = require('../src/utils/helperFuncs')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-balance-sheets'

const types = ['Annual', 'Quarterly']

async function handleBalanceSheet(symbol, balanceSheet, type) {
  const exists = await db.MsBalanceSheet.findOne({
    where: {
      statementType: type,
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', balanceSheet.PeriodEndingDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(balanceSheet)) {
    obj[camelCase(key)] = balanceSheet[key]
  }

  if (exists) {
    try {
      await db.MsBalanceSheet.update(obj, {
        where: {
          statementType: type,
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', balanceSheet.PeriodEndingDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsBalanceSheet option')
    }
    return
  }

  try {
    await db.MsBalanceSheet.create(obj)
  } catch (err) {
    logger.error({ err }, 'Failed in storing MsBalanceSheet option')
  }
}

async function updateMsBalanceSheets() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  const startYear = moment().subtract(2, 'year').year()
  const endYear = moment().year()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    for (const type of types) {
      const balanceSheets = await requestHelper(processName, () => morningstar.balanceSheets({
        token,
        exchangeId: symbol.exchangeId,
        symbol: symbol.symbol,
        startDate: `01/${startYear}`,
        endDate: `12/${endYear}`,
        type,
      }))

      if (!balanceSheets || !balanceSheets.BalanceSheetEntityList || Object.keys(balanceSheets.BalanceSheetEntityList).length === 0) {
        continue
      }


      for (const balanceSheet of balanceSheets.BalanceSheetEntityList) {
        await handleBalanceSheet(symbol, balanceSheet, type)
      }
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateMsBalanceSheets = new CronJob('0 19 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 7pm')

    try {
      await updateMsBalanceSheets()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating ms balance sheets')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateMsBalanceSheets()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
