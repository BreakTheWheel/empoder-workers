/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')
const barchart = require('../src/services/barchart')

const processName = 'barchart-options'

async function handleStockOption(option, now) {
  const obj = {
    period: now,
    symbol: 'APHA',
    code: option.symbol,
  }

  delete option.symbol

  try {
    await db.BarchartOption.create({
      ...obj,
      ...option,
    })
  } catch (err) {
    logger.error({ err }, 'Failed in storing barchart option')
  }
}

async function updateStockOptions() {
  const now = moment.utc().toDate()

  logger.info({ processName })
  let options

  while (!options) {
    try {
      options = await barchart.equityOptions({ symbol: 'APHA' })
    } catch (err) {
      const message = err.response && err.response.data

      logger.error({ processName, err }, message)
      await wait(2)
    }
  }

  let promises = []

  for (const option of options.results) {
    promises.push(handleStockOption(option, now))

    if (promises.length === 100) {
      await Promise.all(promises)

      promises = []
    }
  }

  await Promise.all(promises)

  promises = []
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateStockOptions = new CronJob('*/15 * * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every 15 minutes')

    try {
      await updateStockOptions()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating stock options')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

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
