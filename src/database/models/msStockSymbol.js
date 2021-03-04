
module.exports = (sequelize, Sequelize) => {
  const MsStockSymbol = sequelize.define('MsStockSymbol', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    companyName: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'company_name',
    },
    exchangeId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'exchange_id',
    },
    cik: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sedol: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cusip: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    investmentTypeId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'investment_type_id',
    },
    stockStatus: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'stock_status',
    },
    parValue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'par_value',
    },
    suspendedFlag: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'suspended_flag',
    },
    marketDataId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'market_data_id',
    },
    tracking: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    sectorId: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      field: 'sector_id',
    },
  },
    {
      tableName: 'ms_stock_symbols',
      timestamps: false,
      underscored: true,
    },
  )

  MsStockSymbol.associate = models => {
    MsStockSymbol.belongsTo(models.MsExchange, { as: 'exchange', foreignKey: 'exchangeId', targetKey: 'exchangeId' })
  }

  return MsStockSymbol
}
