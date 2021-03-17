
module.exports = (sequelize, Sequelize) => {
  const MsSymbolsGuide = sequelize.define('MsSymbolsGuide', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    securityType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'security_type',
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'company_name',
    },
    tradedCurrency: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'traded_currency',
    },
    listedCurrency: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'listed_currency',
    },
    msPerformanceId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'ms_performance_id',
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    exchangeCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'exchange_code',
    },
    rootCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'root_code',
    },
    originalExchangeCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'original_exchange_code',
    },
    localInstrumentCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'local_instrument_code',
    },
    sedol: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyInfo: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'company_info',
    },
    fundType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'fund_type',
    },
    figiCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'figi_code',
    },
    figiCountryCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'figi_country_code',
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cusip: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
    {
      tableName: 'ms_symbols_guide',
      timestamps: false,
      underscored: true,
    },
  )

  return MsSymbolsGuide
}
