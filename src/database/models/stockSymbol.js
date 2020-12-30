
module.exports = (sequelize, Sequelize) => {
  const StockSymbol = sequelize.define('StockSymbol', {
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    displaySymbol: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'display_symbol',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'stock_symbols',
      timestamps: false,
      underscored: true,
    },
  )

  return StockSymbol
}
