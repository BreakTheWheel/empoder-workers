/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

const processName = 'upgrade-downgrade'

async function handleUpgradeDowngrade(symbol, upgradeDowngrade) {
  const gradeTime = moment.unix(upgradeDowngrade.gradeTime).toDate()

  const exists = await db.UpgradeDowngrade.findOne({
    where: {
      symbol,
      company: upgradeDowngrade.company,
      [db.sequelize.Op.and]: [
        db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('grade_time')), '=', gradeTime),
      ],
    },
  })

  upgradeDowngrade.gradeTime = gradeTime

  if (!exists) {
    await db.UpgradeDowngrade.create(upgradeDowngrade)
  } else {
    await db.UpgradeDowngrade.update(upgradeDowngrade, {
      where: {
        symbol,
        company: upgradeDowngrade.company,
        [db.sequelize.Op.and]: [
          db.sequelize.where(db.sequelize.fn('date', db.sequelize.col('grade_time')), '=', gradeTime),
        ],
      },
    })
  }
}

async function updateUpgradeDowngrade() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(s => s.symbol)

  for (const symbol of stockSymbols) {
    let upgradeDowngrade

    while (!upgradeDowngrade) {
      try {
        upgradeDowngrade = await finhub.upgradeDowngrade({ symbol })
      } catch (err) {
        logger.error({ processName, err }, 'Failed on FN upgrade downgrade')
        await wait(2)
      }
    }

    let promises = []

    for (const ud of upgradeDowngrade) {
      const promise = handleUpgradeDowngrade(symbol, ud)

      promises.push(promise)

      if (promises.length === 50) {
        await Promise.all(promises)

        promises = []
      }
    }

    await Promise.all(promises)

    promises = []
  }
}

const startImmediately = process.env.START_IMMEDIATELY === 'true'
const stopped = process.env.STOPPED === 'true'

module.exports.updateUpgradeDowngrade = new CronJob('0 7 * * *', async () => {
  if (!startImmediately && !stopped) {
    logger.info({ processName }, 'Running every day at 7am')

    try {
      await updateUpgradeDowngrade()
    } catch (err) {
      logger.error({ processName, err }, 'Failed in updating price targets')
    }

    logger.info({ processName }, 'Done')
  }
}, null, true, 'America/New_York');

if (startImmediately) {
  (async function () {
    try {
      await updateUpgradeDowngrade()
      logger.info({ processName }, 'Done')
    } catch (err) {
      logger.error({ processName, err })
    }
  })()
}
