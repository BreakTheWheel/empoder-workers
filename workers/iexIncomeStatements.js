/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { requestHelper } = require('../src/utils/helperFuncs')
const iexCloud = require('../src/services/iexCloud')

const processName = 'iex-income-statements'

const types = ['annual', 'quarterly']

async function handleIncomeStatement(symbol, incomeStatement, type) {
  delete incomeStatement.id

  const exists = await db.IexIncomeStatement.findOne({
    where: {
      freq: type,
      symbol,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('fiscal_date')), '=', incomeStatement.fiscalDate),
      ],
    },
  })
  const obj = {
    freq: type,
    symbol,
    ...incomeStatement,
  }

  if (exists) {
    try {
      await db.IexIncomeStatement.update(obj, {
        where: {
          freq: type,
          symbol,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('fiscal_date')), '=', incomeStatement.fiscalDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing IexIncomeStatement option')
    }
    return
  }

  try {
    await db.IexIncomeStatement.create(obj)
  } catch (err) {
    logger.error({ err }, 'Failed in storing IexIncomeStatement option')
  }
}

async function updateIexIncomeStatements() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
    order: [
      ['sectorId', 'ASC'],
    ],
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    for (const type of types) {
      const incomeStatements = await requestHelper(processName, () => iexCloud.incomeStatements({ symbol, period: type }))

      if (!incomeStatements || Object.keys(incomeStatements).length === 0) {
        continue
      }

      let promises = []

      for (const incomeStatement of incomeStatements.income) {
        promises.push(handleIncomeStatement(symbol, incomeStatement, type))

        if (promises.length === 100) {
          await Promise.all(promises)

          promises = []
        }
      }

      await Promise.all(promises)

      promises = []
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateIexIncomeStatements = new CronJob('0 18 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 6pm')

    try {
      await updateIexIncomeStatements()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating stock options')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateIexIncomeStatements()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}

