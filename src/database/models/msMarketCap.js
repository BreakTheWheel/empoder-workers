
module.exports = (sequelize, Sequelize) => {
  const MsMarketCap = sequelize.define('MsMarketCap', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    stockSymbolId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'stock_symbol_id',
      references: {
        model: 'ms_stock_symbols',
        key: 'id',
      },
    },
    marketCapDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'market_cap_date',
    },
    enterpriseValue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'enterprise_value',
    },
    currencyId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'currency_id',
    },
    sharesOutstanding: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'shares_outstanding',
    },
    sharesDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'shares_date',
    },
  },
    {
      tableName: 'ms_market_cap',
      timestamps: false,
      underscored: true,
    },
  )

  return MsMarketCap
}
