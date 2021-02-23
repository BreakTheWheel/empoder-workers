/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'fund-ownership'

async function handleFundOwnership(symbol, ownership) {
  try {
    let fund = await db.Fund.findOne({ attributes: ['id'], where: { name: ownership.name } })

    if (!fund) {
      fund = await db.Fund.create({ name: ownership.name })
    }

    const exists = await db.FundOwnership.findOne({
      where: {
        symbol,
        fundId: fund.id,
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('filing_date')), '=', ownership.filingDate),
        ],
      },
    })

    const obj = {
      symbol,
      fundId: fund.id,
      share: ownership.share,
      change: ownership.change,
      filingDate: ownership.filingDate,
      portfolioPercent: ownership.portfolioPercent,
    }

    if (!exists) {
      await db.FundOwnership.create(obj)
    } else {
      await db.FundOwnership.update(obj, {
        where: {
          symbol,
          fundId: fund.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('filing_date')), '=', ownership.filingDate),
          ],
        },
      })
    }
  } catch (err) {
    logger.error({ processName, err }, `Failed to store ownership for symbol ${symbol}`)
  }
}

async function updateFundOwnership() {
  let symbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
    order: [
      ['sectorId', 'ASC'],
    ],
  })
  symbols = symbols.map(s => s.symbol)

  for (const symbol of symbols) {
    let fundOwnership

    while (!fundOwnership) {
      try {
        fundOwnership = await finhub.fundOwnership({ symbol })
      } catch (err) {
        logger.error({ processName, err }, `Failed to get fund ownership for ${symbol}`)
        if (err.response && err.response.status === 401) {
          break
        }
        await wait(2)
      }
    }

    try {
      logger.info({ processName }, `fund ownership: ${symbol}`)
      let promises = []

      for (const own of fundOwnership.ownership) {
        promises.push(handleFundOwnership(symbol, own))

        if (promises.length === 100) {
          await Promise.all(promises)

          promises = []
        }
      }

      await Promise.all(promises)

    } catch (err) {
      logger.error({ processName, err }, 'Failed on FN fund ownership')
      await wait(2)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.fundOwnership = new CronJob('0 20 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 8pm')

    try {
      await updateFundOwnership()
    } catch (err) {
      logger.error({ err }, 'Failed in updating fund ownership')
    }

    logger.info({ processName }, 'Done')
  }
}, null, false, 'America/Los_Angeles');

if (startImmediately) {
  (async function () {
    try {
      await updateFundOwnership()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
