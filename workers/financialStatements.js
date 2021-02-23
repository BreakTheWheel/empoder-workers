/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'financial-statements'

const types = [
  { type: 'ic', freq: 'quarterly' },
  { type: 'ic', freq: 'annual' },
  { type: 'ic', freq: 'ttm' },
  { type: 'bs', freq: 'quarterly' },
  { type: 'bs', freq: 'annual' },
]

async function handleFinancialStatement(symbol, statement, type) {
  statement.freq = type.freq

  let model = db.IncomeStatement

  if (type.type === 'cf') {
    model = db.CashFlowStatement
  }

  if (type.type === 'bs') {
    model = db.BalanceSheet
  }

  try {
    const exists = await model.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', statement.period),
        ],
        symbol,
        freq: type.freq,
      },
    })

    if (!exists) {
      await model.create(statement)
    } else {
      await model.update(statement, {
        where: {
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', statement.period),
          ],
          symbol,
          freq: type.freq,
        },
      })
    }
  } catch (err) {
    logger.error({ processName, sqlError: err.parent ? err.parent.message : '' })
    logger.error({ processName, err }, `Failed to store statement for symbol ${symbol}`)
  }
}

async function updateFinancialStatements() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
    order: [
      ['sectorId', 'ASC'],
    ],
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Statement for symbol: ${symbol}`)

    for (const type of types) {
      let statements

      while (!statements) {
        try {
          statements = await finhub.financialStatements({ symbol, type: type.type, freq: type.freq })
        } catch (err) {
          logger.error({ processName, err }, 'Failed to get financial statements')
          if (err.response && err.response.status === 401) {
            break
          }
          await wait(2)
        }
      }

      if (!statements || !statements.financials) {
        continue
      }

      for (const statement of statements.financials) {
        statement.symbol = symbol

        promises.push(handleFinancialStatement(symbol, statement, type))
      }

      await Promise.all(promises)

      promises = []
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateFinancialStatements = new CronJob('30 16 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 16:30')

    try {
      await updateFinancialStatements()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating financial statements')
    }

    logger.info({ processName }, 'Done')

  }
}, null, false, 'America/New_York');


if (startImmediately) {
  (async function () {
    try {
      logger.info('Starting immediately')
      await updateFinancialStatements()

      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
