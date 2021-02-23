/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const logger = require('../src/common/logger')
const { exec } = require('child_process');

const processName = 'cleanup'

function cleanup() {
  logger.info({ processName, currentPath: __dirname })

  return new Promise((resolve, reject) => {
    exec('rm /var/log/messages*', (err, stdout, stderr) => {
      if (err) {
        logger.error({ err })
        logger.error({ stderr })
        return reject(new Error('Failed'))
      }

      resolve()
    })
  })
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.cleanup = new CronJob('*/15 * * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every 15 minutes')

    try {
      await cleanup()
    } catch (err) {
      logger.error({ processName, err }, 'Failed to cleanup')
    }

    logger.info('Done')
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