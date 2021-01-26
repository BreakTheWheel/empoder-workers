/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const types = ['ic', 'bs']

async function handleFinancialStatement(symbol, statement, type) {
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
      },
    })

    if (!exists) {
      await model.create(statement)
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
          statements = await finhub.financialStatements({ symbol, type })
        } catch (err) {
          logger.error({ err }, 'Failed to get financial statements')
          await wait(2)
        }
      }

      if (!statements.financials) {
        continue
      }

      for (const statement of statements.financials) {
        logger.info(`Statement for symbol: ${symbol}`)

        statement.symbol = symbol

        promises.push(await handleFinancialStatement(symbol, statement, type))
      }

      await Promise.all(promises)

      promises = []
    }
  }
}

module.exports.updateFinancialStatements = new CronJob('0 11 * * *', async () => {
  logger.info('Running every day at 11am')

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
