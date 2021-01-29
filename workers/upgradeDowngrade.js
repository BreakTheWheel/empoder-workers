/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const moment = require('moment')
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

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

  if (!exists) {
    upgradeDowngrade.gradeTime = gradeTime

    await db.UpgradeDowngrade.create(upgradeDowngrade)
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
        logger.error({ err }, 'Failed on FN upgrade downgrade')
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
  }
}

module.exports.updateUpgradeDowngrade = new CronJob('0 7 * * *', async () => {
  logger.info('Running every day at 7am')

  try {
    await updateUpgradeDowngrade()
  } catch (err) {
    logger.error({ err }, 'Failed in updating price targets')
  }

  logger.info('Done')
}, null, true, 'America/New_York');


// (async function () {
//   try {
//     await updateUpgradeDowngrade()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
