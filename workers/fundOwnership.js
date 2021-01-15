/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')
const Promise = require('bluebird')

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

    if (!exists) {
      await db.FundOwnership.create({
        symbol,
        fundId: fund.id,
        share: ownership.share,
        change: ownership.change,
        filingDate: ownership.filingDate,
        portfolioPercent: ownership.portfolioPercent,
      })
    }
  } catch (err) {
    logger.error({ err }, `Failed to store ownership for symbol ${symbol}`)
  }
}

async function updateFundOwnership() {
  let symbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  symbols = symbols.map(s => s.symbol)

  for (const symbol of symbols) {
    let fundOwnership

    while (!fundOwnership) {
      try {
        fundOwnership = await finhub.fundOwnership({ symbol })
      } catch (err) {
        logger.error({ err }, `Failed to get fund ownership for ${symbol}`)
        await wait(2)
      }
    }

    try {
      logger.info(`fund ownership: ${symbol}`)
      let promises = []

      for (const own of fundOwnership.ownership) {
        promises.push(handleFundOwnership(symbol, own))

        if (promises.length === 50) {
          await Promise.all(promises)

          promises = []
        }
      }
    } catch (err) {
      logger.error({ err }, 'Failed on FN fund ownership')
      await wait(2)
    }
  }
}

module.exports.fundOwnership = new CronJob('0 19 * * *', async () => {
  logger.info('Running every day at 7pm')

  try {
    await updateFundOwnership()
  } catch (err) {
    logger.error({ err }, 'Failed in updating fund ownership')
  }

  logger.info('Done')
}, null, true, 'America/Los_Angeles');


// (async function () {
//   try {
//     await updateFundOwnership()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()