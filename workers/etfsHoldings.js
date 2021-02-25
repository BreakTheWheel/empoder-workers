/* eslint-disable no-await-in-loop */
const moment = require('moment')
const CronJob = require('cron').CronJob
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { requestHelper } = require('../src/utils/helperFuncs')

const processName = 'etfs-holdings'

async function updateEtfsHoldings() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: {
      type: 'ETP',
      [db.sequelize.Op.or]: [
        { exchange: 'us' },
        { exchange: 'to' },
      ],
    },
  })

  stockSymbols = stockSymbols.map(c => c.symbol)

  let counter = 1
  for (const symbol of stockSymbols) {
    logger.info({ processName }, `etfsholdings processing symbol: ${symbol}, counter: ${counter++} of ${stockSymbols.length}`)

    const holdingsResult = await requestHelper(processName, () => finhub.etfsHoldings({ symbol }))

    if (!holdingsResult || holdingsResult.symbol) {
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

    if (exists) {
      continue
    }

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
      logger.error({ processName, err })
      await transaction.rollback()
    }
  }
}

async function handleAggregates() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(c => c.symbol)

  const today = moment().format('YYYY-MM-DD')

  let counter = 1
  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Proccessing aggregates for ${symbol}, counter: ${counter++} of ${stockSymbols.length}`)

    const exists = await db.EtfsAggregate.findOne({
      where: {
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('date')), '=', today),
        ],
        symbol,
      },
    })

    if (!exists) {
      const agg = await db.sequelize.query(`
        select sum(etv.share) as total_shares, sum(etv.value) as total_value
        from etfs_holding_values etv
        join etfs_holdings et
        on etv.etfs_holding_id = et.id
        where etv.holds_symbol = '${symbol}' and et.active = true and share is not null
        group by etv.holds_symbol
      `)

      const arr = agg[0]
      const obj = arr[0]

      if (obj) {
        await db.EtfsAggregate.create({
          totalValue: obj.total_value,
          totalShares: obj.total_shares,
          date: today,
          symbol,
        })
      }
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateEtfsHoldings = new CronJob('0 23 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 11pm')

    try {
      await updateEtfsHoldings()
      await handleAggregates()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating etfs holdings')
    }

    logger.info({ processName }, 'Done')
  }

}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateEtfsHoldings()
      await handleAggregates()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
