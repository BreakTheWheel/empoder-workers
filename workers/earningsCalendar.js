/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handleEarning(symbol, earning) {
  try {
    const exists = await db.EarningsCalendar.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), '=', earning.date),
        ],
        symbol,
      },
    })

    if (!exists) {
      await db.EarningsCalendar.create(earning)
    } else {
      await db.EarningsCalendar.update(earning, {
        where: {
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), '=', earning.date),
          ],
          symbol,
        },
      })
    }
  } catch (err) {
    logger.error({ err }, `Failed to store earnings calendar for symbol ${symbol}`)
  }
}

async function updateEarningsCalendar() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })

  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    let earnings

    while (!earnings) {
      try {
        const from = moment.utc().subtract(2, 'years').format('YYYY-MM-DD')
        const to = moment.utc().add(1, 'year').format('YYYY-MM-DD')

        earnings = await finhub.earningsCalendar({ symbol, from, to })
      } catch (err) {
        if (err.response && err.response.status === 401) {
          break
        }
        logger.error({ err }, 'Failed to get earnings calendar')
        await wait(2)
      }
    }

    if (!earnings || earnings.length === 0) {
      logger.info(`Missing earnings calendar for ${symbol}`)
      continue
    }

    for (const earning of earnings.earningsCalendar) {
      logger.info(`earnings calendar: ${symbol}`)

      earning.symbol = symbol

      promises.push(handleEarning(symbol, earning))
    }

    await Promise.all(promises)

    await wait(1)

    promises = []
  }
}

module.exports.updateEarningsCalendar = new CronJob('0 15 * * *', async () => {
  logger.info('Running every day at 15:00')

  try {
    await updateEarningsCalendar()
  } catch (err) {
    logger.error({ err }, 'Failed in updating earnings calendar')
  }

  logger.info('Done')
}, null, true, 'America/New_York');


// (async function () {
//   try {
//     await updateEarningsCalendar()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
