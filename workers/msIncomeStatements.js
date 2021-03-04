/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const moment = require('moment')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-income-statements'

const types = ['Annual', 'Quarterly']

async function handleIncomeStatement(symbol, incomeStatement, type) {
  const exists = await db.MsIncomeStatement.findOne({
    where: {
      statementType: type,
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', incomeStatement.PeriodEndingDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(incomeStatement)) {
    obj[camelCase(key)] = incomeStatement[key]
  }

  if (exists) {
    try {
      await db.MsIncomeStatement.update(obj, {
        where: {
          statementType: type,
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', incomeStatement.PeriodEndingDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsIncomeStatement option')
    }
    return
  }

  try {
    await db.MsIncomeStatement.create(obj)
  } catch (err) {
    logger.error({ err }, 'Failed in storing MsIncomeStatement option')
  }
}

async function updateIncomeStatements() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  const startYear = moment().subtract(2, 'year').year()
  const endYear = moment().year()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    for (const type of types) {
      const incomeStatements = await requestHelper(processName, () => morningstar.incomeStatements({
        token,
        exchangeId: symbol.exchangeId,
        symbol: symbol.symbol,
        startDate: `01/${startYear}`,
        endDate: `12/${endYear}`,
        type,
      }))

      if (!incomeStatements || !incomeStatements.IncomeStatementEntityList || Object.keys(incomeStatements.IncomeStatementEntityList).length === 0) {
        continue
      }

      for (const incomeStatement of incomeStatements.IncomeStatementEntityList) {
       await  handleIncomeStatement(symbol, incomeStatement, type)
      }
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateIncomeStatements = new CronJob('0 21 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 9pm')

    try {
      await updateIncomeStatements()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating stock options')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateIncomeStatements()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}

