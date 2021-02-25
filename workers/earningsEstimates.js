/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait, requestHelper } = require('../src/utils/helperFuncs')

const processName = 'earnings-estimates'

async function handleEarning(symbol, earning) {
  try {
    const exists = await db.EarningsEstimate.findOne({
      attributes: ['id'],
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', earning.period),
        ],
        symbol,
      },
    })

    if (!exists) {
      await db.EarningsEstimate.create(earning)
    } else {
      await db.EarningsEstimate.update(earning, {
        where: {
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('period')), '=', earning.period),
          ],
          symbol,
        },
      })
    }
  } catch (err) {
    logger.error({ processName, err }, `Failed to store earnings estimate for symbol ${symbol}`)
  }
}

async function updateEarningsEstimates() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)
  let promises = []

  for (const symbol of stockSymbols) {
    const earnings = await requestHelper(processName, () => finhub.earningsEstimate({ symbol }))

    if (!earnings) {
      continue
    }

    for (const earning of earnings.data) {
      logger.info({ processName }, `earnings estimates: ${symbol}`)

      earning.symbol = symbol

      promises.push(handleEarning(symbol, earning))
    }

    await Promise.all(promises)

    promises = []
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateEarningsEstimates = new CronJob('0 14 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 2pm')

    try {
      await updateEarningsEstimates()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating earnings estimates')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateEarningsEstimates()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}