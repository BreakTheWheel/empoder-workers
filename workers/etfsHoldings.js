/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function updateEtfsHoldings() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { type: 'ETP' },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  for (const symbol of stockSymbols) {
    logger.info(`etfsholdings processing symbol: ${symbol}`)

    let holdingsResult

    while (!holdingsResult) {
      try {
        holdingsResult = await finhub.etfsHoldings({ symbol })
      } catch (err) {
        logger.error({ err }, 'Failed to get holdings')
        await wait(2)
      }
    }

    if (!holdingsResult.symbol) {
      continue
    }

    const exists = await db.EtfsHolding.findOne({
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('at_date')), '=', holdingsResult.atDate),
        ],
        symbol,
      },
    })

    if (!exists) {
      const transaction = await db.sequelize.transaction()

      try {
        await db.EtfsHolding.update({ active: false }, { where: { symbol, active: true }, transaction })
        const etfsHold = await db.EtfsHolding.create({
          symbol,
          atDate: holdingsResult.atDate,
          active: true,
        }, { transaction })

        const mapped = holdingsResult.holdings.map(h => {
          return {
            etfsHoldingId: etfsHold.id,
            cusip: h.cusip,
            isin: h.isin,
            name: h.name,
            percent: h.percent,
            share: h.share,
            holdsSymbol: h.symbol,
            value: h.value,
          }
        })

        let promises = []

        for (const map of mapped) {
          promises.push(db.EtfsHoldingValue.create(map, { transaction }))

          if (promises.length === 100) {
            await Promise.all(promises)
            promises = []
          }
        }

        await Promise.all(promises)
        await transaction.commit()
      } catch (err) {
        logger.error({ err })
        await transaction.rollback()
      }
    }
  }
}

module.exports.updateEtfsHoldings = new CronJob('0 23 * * *', async () => {
  logger.info('Running every day at 11pm')

  try {
    await updateEtfsHoldings()
  } catch (err) {
    logger.error({ err }, 'Failed in updating etfs holdings')
  }

  logger.info('Done')
}, null, true, 'America/New_York');


// (async function () {
//   try {
//     await updateEtfsHoldings()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
