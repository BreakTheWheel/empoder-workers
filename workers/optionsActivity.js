/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')
const iexCloud = require('../src/services/iexCloud')

const processName = 'options-activity'

async function handleStockOption(symbol, stockOption) {
  const exists = await db.StockOption.findOne({
    attributes: ['id'],
    where: {
      subkey: stockOption.subkey,
    },
  })
  const externalId = stockOption.id
  const updated = moment.unix(stockOption.updated).toDate()
  const date = moment.unix(stockOption.date).toDate()
  const expirationDate = stockOption.expirationDate ?
    moment(stockOption.expirationDate, 'YYYYMMDD')
      .format('YYYY-MM-DD') :
    null

  delete stockOption.id
  delete stockOption.expirationDate

  const obj = {
    symbol,
    externalId,
    expirationDate,
    dateUnix: stockOption.date,
    updatedUnix: stockOption.updated,
    date,
    updated,
    ...stockOption,
  }
  if (!exists) {
    await db.StockOption.create(obj)
  } else {
    await db.StockOption.update(obj, { where: { subkey: stockOption.subkey } })
  }
}

async function updateStockOptions() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(s => s.symbol)

  for (const symbol of stockSymbols) {
    logger.info({ processName }, `Processing symbol: ${symbol}`)
    let optionDates

    while (!optionDates) {
      try {
        optionDates = await iexCloud.stockOptionDates({ symbol })
      } catch (err) {
        const message = err.response && err.response.data

        if (message === 'Not found' || message === 'Unknown symbol') { // symbol does not exist
          logger.error({ processName }, `Symbol ${symbol} not found in IEX`)
          break
        }

        logger.error({ processName, err }, 'Failed on IEX optionDates activity')
        await wait(2)
      }
    }

    if (!optionDates || !optionDates.length) {
      continue
    }

    for (const expiration of optionDates) {
      let stockOptions

      while (!stockOptions) {
        try {
          stockOptions = await iexCloud.stockOptions({ symbol, expiration })
        } catch (err) {
          logger.error({ processName, err }, 'Failed on IEX optionDates activity')
          await wait(2)
        }
      }

      let promises = []

      for (const stockOption of stockOptions) {
        promises.push(handleStockOption(symbol, stockOption))

        if (promises.length === 100) {
          await Promise.all(promises)

          promises = []
        }
      }

      await Promise.all(promises)
    }
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

// Data schedule: 9:30am ET Mon-Fri - suggested 11am
module.exports.updateStockOptions = new CronJob('0 11 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 11am')
    const day = moment().isoWeekday()

    if (day === 6 || day === 7) {
      logger.info('Its weekend')
      return
    }

    try {
      await updateStockOptions()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating stock options')
    }

    logger.info('Done')
  }
}, null, true, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateStockOptions()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
