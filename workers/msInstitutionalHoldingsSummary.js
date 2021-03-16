/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const { camelCase } = require('change-case')
const { requestHelper } = require('../src/utils/helperFuncs')
const db = require('../src/database')
const logger = require('../src/common/logger')
const morningstar = require('../src/services/morningstar')
const stockService = require('../src/services/stockService')

const processName = 'ms-institutional-holdings-summary'

async function handleItem(symbol, item) {
  const exists = await db.MsInstitutionalHoldingsSummary.findOne({
    where: {
      stockSymbolId: symbol.id,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', item.AsOfDate),
      ],
    },
  })

  const obj = { stockSymbolId: symbol.id }

  for (const key of Object.keys(item)) {
    obj[camelCase(key)] = item[key]
  }

  if (exists) {
    try {
      await db.MsInstitutionalHoldingsSummary.update(obj, {
        where: {
          stockSymbolId: symbol.id,
          [db.sequelize.Op.and]: [
            db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('as_of_date')), '=', item.AsOfDate),
          ],
        },
      })
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsInstitutionalHoldingsSummary option')
    }
  } else {
    try {
      await db.MsInstitutionalHoldingsSummary.create(obj)
    } catch (err) {
      logger.error({ err }, 'Failed in storing MsInstitutionalHoldingsSummary option')
    }
  }
}

async function institutionalHoldingsSummary() {
  const token = await morningstar.login()
  const stockSymbols = await stockService.getTrackingStocks()

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol ${symbol.symbol}`)

    const summary = await requestHelper(processName, () => morningstar.institutionalHoldingsSummary({
      token,
      exchangeId: symbol.exchangeId,
      symbol: symbol.symbol,
    }))

    if (!summary || !summary.InstitutionalHoldingsSummaryEntity || Object.keys(summary.InstitutionalHoldingsSummaryEntity).length === 0) {
      continue
    }

    await handleItem(symbol, summary.InstitutionalHoldingsSummaryEntity)
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateInstitutionalHoldingsSummary = new CronJob('0 17 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 5pm')

    try {
      await institutionalHoldingsSummary()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating institutional holdings detail cap')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await institutionalHoldingsSummary()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
