/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

// not used for now

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

async function updateIpoCalendar() {
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
        logger.error({ err }, 'Failed to get earnings calendar')
        await wait(2)
      }
    }

    for (const earning of earnings.earningsCalendar) {
      logger.info(`earnings calendar: ${symbol}`)

      earning.symbol = symbol

      promises.push(handleEarning(symbol, earning))
    }

    await Promise.all(promises)

    promises = []
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateIpoCalendar = new CronJob('0 21 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info('Running every day at 9pm')

    try {
      await updateIpoCalendar()
    } catch (err) {
      logger.error({ err }, 'Failed in updating IPO calendar')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');


if (startImmediately) {
  (async function () {
    try {
      await updateIpoCalendar()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ err })
    }
  })()
}
