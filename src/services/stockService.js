const db = require('../database')

const exchanges = [
  'ARCX',
  'PINX',
  'ASE',
  'NAS',
  'NYS',
  'OTC',
  'GREY',
]

module.exports = {
  exchanges,
  getTrackingStocks: async () => {
    const stockSymbols = await db.MsStockSymbol.findAll({
      attributes: ['symbol', 'id', 'exchangeId'],
      where: {
        sectorId: {
          [db.sequelize.Op.ne]: null,
        },
        exchangeId: {
          [db.sequelize.Op.in]: exchanges,
        },
      },
    })

    return stockSymbols
  },
}
