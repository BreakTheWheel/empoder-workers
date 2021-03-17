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

const types = ['Annual', 'Quarterly', 'TTM']

async function handleIncomeStatement(symbol, incomeStatement) {
  const exists = await db.MsIncomeStatement.findOne({
    where: {
      statementType: incomeStatement.StatementType,
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
          statementType: incomeStatement.StatementType,
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period_ending_date')), '=', incomeStatement.PeriodEndingDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in updating MsIncomeStatement')
    }
    return
  }

  try {
    await db.MsIncomeStatement.create(obj)
  } catch (err) {
    logger.error({ err }, 'Failed in storing MsIncomeStatement')
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
      let incomeStatements
      const params = {
        token,
        exchangeId: symbol.exchangeId,
        symbol: symbol.symbol,
        startDate: `01/${startYear}`,
        endDate: `12/${endYear}`,
        type,
      }

      if (type === 'TTM') {
        incomeStatements = await requestHelper(processName, () => morningstar.incomeStatementsTTM(params))
      } else {
        incomeStatements = await requestHelper(processName, () => morningstar.incomeStatements(params))
      }

      if (!incomeStatements || !incomeStatements.IncomeStatementEntityList || Object.keys(incomeStatements.IncomeStatementEntityList).length === 0) {
        continue
      }

      for (const incomeStatement of incomeStatements.IncomeStatementEntityList) {
        handleIncomeStatement(symbol, incomeStatement)
      }
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateIncomeStatements = new CronJob('0 20 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 8pm')

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

