/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const types = [
  { type: 'ic', freq: 'quarterly' },
  { type: 'ic', freq: 'yearly' },
  { type: 'bs', freq: 'quarterly' },
]

async function handleFinancialStatement(symbol, statement, type) {
  statement.freq = type.freq

  let model = db.IncomeStatement

  if (type === 'cf') {
    model = db.CashFlowStatement
  }

  if (type === 'bs') {
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
    logger.error({ err }, `Failed to store statement for symbol ${symbol}`)
  }
}

async function updateFinancialStatements() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    for (const type of types) {
      let statements

      while (!statements) {
        try {
          statements = await finhub.financialStatements({ symbol, type: type.type, freq: type.freq })
        } catch (err) {
          if (err.response && err.response.status === 401) {
            break
          }
          logger.error({ err }, 'Failed to get financial statements')
          await wait(2)
        }
      }

      if (!statements || !statements.financials) {
        continue
      }

      for (const statement of statements.financials) {
        logger.info(`Statement for symbol: ${symbol}`)

        statement.symbol = symbol

        promises.push(handleFinancialStatement(symbol, statement, type))
      }

      await Promise.all(promises)

      promises = []
    }
  }
}

module.exports.updateFinancialStatements = new CronJob('0 12 * * *', async () => {
  logger.info('Running every day at 12am')

  try {
    await updateFinancialStatements()
  } catch (err) {
    logger.error({ err }, 'Failed in updating financial statements')
  }

  logger.info('Done')
}, null, true, 'America/New_York');

// (async function () {
//   try {
//     await updateFinancialStatements()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
