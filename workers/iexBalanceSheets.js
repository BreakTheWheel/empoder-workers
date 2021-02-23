/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')
const iexCloud = require('../src/services/iexCloud')

const processName = 'iex-balance-sheets'

const types = ['annual', 'quarterly']

async function handleBalanceSheet(symbol, balanceSheet, type) {
  delete balanceSheet.id

  const exists = await db.IexBalanceSheet.findOne({
    where: {
      freq: type,
      symbol,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('fiscal_date')), '=', balanceSheet.fiscalDate),
      ],
    },
  })
  const obj = {
    freq: type,
    symbol,
    ...balanceSheet,
  }

  if (exists) {
    try {
      await db.IexBalanceSheet.update(obj, {
        where: {
          freq: type,
          symbol,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('fiscal_date')), '=', balanceSheet.fiscalDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing IexBalanceSheet option')
    }
    return
  }

  try {
    await db.IexBalanceSheet.create(obj)
  } catch (err) {
    logger.error({ err }, 'Failed in storing IexBalanceSheet option')
  }
}

async function updateIexBalanceSheets() {
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
      let balanceSheets

      while (!balanceSheets) {
        try {
          balanceSheets = await iexCloud.balanceSheet({ symbol, period: type })
        } catch (err) {
          const message = err.response && err.response.data

          if (message === 'Unknown symbol') {
            break
          }

          logger.error({ processName, err }, message)
          await wait(2)
        }
      }

      if (!balanceSheets || Object.keys(balanceSheets).length === 0) {
        continue
      }

      let promises = []

      for (const balanceSheet of balanceSheets.balancesheet) {
        promises.push(handleBalanceSheet(symbol, balanceSheet, type))

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

module.exports.updateIexBalanceSheets = new CronJob('0 21 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 9pm')

    try {
      await updateIexBalanceSheets()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating iex balance sheets')
    }

    logger.info('Done')
  }
}, null, true, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateIexBalanceSheets()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
