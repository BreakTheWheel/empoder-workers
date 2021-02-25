/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const Promise = require('bluebird')
const db = require('../src/database')
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')
const spacs = require('../src/services/spacs')

const processName = 'spacs-teams'

async function handleCompany(company) {
  try {
    await db.SpacCompany.create(company)
  } catch (err) {
    logger.error({ err }, 'Failed in storing barchart option')
  }
}

async function updateCompanies() {
  logger.info({ processName })
  let companies

  while (!companies) {
    try {
      companies = await spacs.allCompanies()
    } catch (err) {
      const message = err.response && err.response.data

      logger.error({ processName, err }, message)
      await wait(2)
    }
  }

  let promises = []

  for (const company of companies) {
    promises.push(handleCompany(company))

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
