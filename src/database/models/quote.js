
module.exports = (sequelize, Sequelize) => {
  const Quote = sequelize.define('Quote', {
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    currentPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'current_price',
    },
    lowPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'low_price',
    },
    highPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'high_price',
    },
    openPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'open_price',
    },
    previousClosePrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'open_price',
    },
  },
    {
      tableName: 'quotes',
      timestamps: false,
      underscored: true,
    },
  )

  return Quote
}
