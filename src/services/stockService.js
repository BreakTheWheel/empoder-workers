const db = require('../database')

module.exports = {
  getTrackingStocks: async () => {
    const stockSymbols = await db.MsStockSymbol.findAll({
      attributes: ['symbol', 'id', 'exchangeId'],
      where: {
        exchangeId: {
          [db.sequelize.Op.in]: [
            'ARCX',
            'PINX',
            'ASE',
            'NAS',
            'NYS',
            'OTC',
            'GREY',
          ],
        },
      },
    })

    return stockSymbols
  },
}
