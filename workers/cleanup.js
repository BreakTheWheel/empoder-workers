/* eslint-disable no-await-in-loop */
const { exec } = require('child_process')
const CronJob = require('cron').CronJob
const logger = require('../src/common/logger')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'cleanup'

async function cleanup() {
  logger.info({ processName, currentPath: __dirname })

  await new Promise((resolve, reject) => {
    exec('rm -f ../../../log/messages*', (err, stdout, stderr) => {
      if (err) {
        logger.error({ err })
        logger.error({ stderr })
        logger.error({ stdout })
        return reject(new Error('Failed'))
      }

      resolve()
    })
  })

  await wait(5)

  await new Promise((resolve, reject) => {
    exec('sudo service rsyslog restart', (err, stdout, stderr) => {
      if (err) {
        logger.error({ err })
        logger.error({ stderr })
        logger.error({ stdout })
        return reject(new Error('Failed'))
      }

      resolve()
    })
  })
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'

module.exports.cleanup = new CronJob('*/30 * * * *', async () => {
  if (!startImmediately) {
    logger.info({ processName }, 'Running every 30 minutes')

    try {
      await cleanup()
    } catch (err) {
      logger.error({ processName, err }, 'Failed to cleanup')
    }

    logger.info({ processName }, 'Done')
  }
}, null, false, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await cleanup()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
