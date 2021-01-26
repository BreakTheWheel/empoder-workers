
module.exports = (sequelize, Sequelize) => {
  const HistoricalPrice = sequelize.define('HistoricalPrice', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    volume: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    close: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    open: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    low: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    high: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
    {
      tableName: 'historical_prices',
      timestamps: false,
      underscored: true,
    },
  )

  return HistoricalPrice
}
