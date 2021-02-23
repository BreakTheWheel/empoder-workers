/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'price-targets'

function priceTargetIsEqual(pt1, pt2) {
  if (!pt1 || !pt2) {
    return false
  }

  return pt1.targetHigh === pt2.targetHigh
    && pt1.targetLow === pt2.targetLow
    && pt1.targetMean === pt2.targetMean
    && pt1.targetMedian === pt2.targetMedian
}

async function updatePriceTargets() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(s => s.symbol)

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `updatePriceTargets Processing symbol: ${symbol}`)
    let priceTarget

    while (!priceTarget) {
      try {
        priceTarget = await finhub.priceTarget({ symbol })
      } catch (err) {
        logger.error({ processName, err }, 'Failed on FN price target endpoint')
        if (err.response && err.response.status === 401) {
          break
        }
        await wait(2)
      }
    }

    if (!priceTarget || !priceTarget.symbol) {
      continue
    }

    const lastPriceTarget = await db.PriceTarget.findOne({
      where: { symbol },
      order: [
        ['last_updated', 'DESC'],
      ],
    })

    // sometimes lastUpdated is different but other values are the same from FH
    if (priceTargetIsEqual(lastPriceTarget, priceTarget)) {
      if (moment(lastPriceTarget.lastUpdated).isSame(moment(priceTarget.lastUpdated), 'day')) {
        continue
      }
      await db.PriceTarget.update(priceTarget, { where: { id: lastPriceTarget.id } })
      continue
    }

    const exists = await db.PriceTarget.findOne({
      where: {
        symbol,
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '=', priceTarget.lastUpdated),
        ],
      },
    })

    if (!exists) {
      await db.PriceTarget.create(priceTarget)
      logger.info({ processName }, `Created price target for symbol: ${symbol}`)
    } else {
      await db.PriceTarget.update(priceTarget, {
        where: {
          symbol,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('last_updated')), '=', priceTarget.lastUpdated),
          ],
        },
      })
      logger.info({ processName }, `Updated price target for symbol: ${symbol}`)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.priceTarget = new CronJob('0 2 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 2am')

    try {
      await updatePriceTargets()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating price targets')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updatePriceTargets()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
