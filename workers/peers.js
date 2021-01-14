/* eslint-disable no-await-in-loop */
const CronJob = require('cron').CronJob;
const db = require('../src/database')
const logger = require('../src/common/logger')
const finhub = require('../src/services/finHub')
const { wait } = require('../src/utils/helperFuncs')

async function handlePeer(symbol, peerSymbol) {
  try {
    const exists = await db.Peer.findOne({
      where: { symbol, peerSymbol }
    })

    if (!exists) {
      await db.Peer.create({ symbol, peerSymbol })
    }
  } catch (err) {
    logger.error({ err }, `Failed to handle peer for ${symbol}`)
  }
}

async function updatePeers() {
  let stockSymbols = await db.StockSymbol.findAll({
    attributes: ['symbol'],
    where: { tracking: true },
  })
  stockSymbols = stockSymbols.map(s => s.symbol)

  const allPeers = new Set()

  for (const symbol of stockSymbols) {
    let peers

    while (!peers) {
      try {
        peers = await finhub.stockPeers({ symbol })
      } catch (err) {
        await wait(2)
      }
    }
    logger.info(`Peers: ${symbol}`)

    const filtered = peers.filter(p => p !== symbol) // original symbol returned as peer again
    let promises = []

    for (const peerSymbol of filtered) {
      try {
        promises.push(handlePeer(symbol, peerSymbol))

        if (promises.length === 50) {
          await Promise.all(promises)

          promises = []
        }
        allPeers.add(peerSymbol)
      } catch (err) {
        logger.error({ err }, 'Failed to store peer')
      }
    }

    await wait(0.3)
  }

  await db.StockSymbol.update({ tracking: true }, {
    where: {
      symbol: { [db.sequelize.Op.in]: [...allPeers] },
    },
  })
}

module.exports.updatePeers = new CronJob('0 4 * * *', async () => {
  logger.info('Running every day at 4am')

  try {
    await updatePeers()
  } catch (err) {
    logger.error({ err }, 'Failed in updating peers')
  }

  logger.info('Done')
}, null, true, 'America/Los_Angeles');


// (async function () {
//   try {
//     await updatePeers()
//   } catch (err) {
//     logger.error({ err })
//   }
// })()
