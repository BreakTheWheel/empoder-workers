/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { requestHelper } = require('../src/utils/helperFuncs')
const spacs = require('../src/services/spacs')

const processName = 'spacs-filings'

async function handleFiling(filling) {
  try {
    await db.SpacFiling.create(filling)
  } catch (err) {
    logger.error({ err }, 'Failed in storing barchart option')
  }
}

async function updateCompanies() {
  logger.info({ processName })
  const filings = requestHelper(processName, () => spacs.latestFilings())

  if (!filings) {
    return
  }

  let promises = []

  for (const filling of filings) {
    promises.push(handleFiling(filling))

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

module.exports.updateCompanies = new CronJob('0 18 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 6pm')

    try {
      await updateCompanies()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating spac companies')
    }

    logger.info('Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateCompanies()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
