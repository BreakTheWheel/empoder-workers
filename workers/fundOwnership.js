/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')

async function wait(secs) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, secs * 1000)
  })
}

const symbols = [
  'AAPL',
  'TSLA',
  'ROKU',
  'NVTA',
  'CRSP',
  'SQ',
  'TDOC',
  'Z',
  'SPOT',
  'EDIT',
  'SMG',
  'CRLBF',
  'GWPH',
  'GRWG',
  'TPB',
  'GNLN',
  'IIPR',
  'TLRY',
  'VFF',
  'CGC',
  'ACB',
  'APHA',
  'HEXO',
]

async function updateFundOwnership() {
  for (const symbol of symbols) {
    let fundOwnership

    while (!fundOwnership) {
      try {
        fundOwnership = await finhub.fundOwnership({ symbol })

        for (const own of fundOwnership.ownership) {
          const exists = await db.PriceTarget.findOne({
            where: { symbol, fillingDate: own.fillingDate },
          })

          if (!exists) {
            await db.Fund.create(own)
          }
        }
      } catch (err) {
        logger.error({ err }, 'Failed on FN fund ownership')
        await wait(2)
      }
    }

    if (!fundOwnership) {
      continue
    }
  }
}

module.exports.fundOwnership = new CronJob('0 */12 * * *', async () => {
  logger.info('Running every 12th hour')

  try {
    await updateFundOwnership()
  } catch (err) {
    logger.error({ err }, 'Failed in updating fund ownership')
  }

  logger.info('Done')
}, null, true, 'America/Los_Angeles');


// (async function () {
//   try {
//     await updateFundOwnership()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()