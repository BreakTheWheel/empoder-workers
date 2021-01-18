
module.exports = (sequelize, Sequelize) => {
  const StockOption = sequelize.define('StockOption', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    ask: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    bid: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    cfiCode: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'cfi_code',
    },
    close: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    closingPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    contractDescription: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'contract_description',
    },
    contractName: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'contract_name',
    },
    contractSize: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'contract_size',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    exchangeCode: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'exchange_code',
    },
    exchangeMic: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'exchange_mic',
    },
    exerciseStyle: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'exercise_style',
    },
    expirationDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'expiration_date',
    },
    figi: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    high: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    isAdjusted: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      field: 'is_adjusted',
    },
    lastTradeDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'last_trade_date',
    },
    lastTradeTime: {
      type: Sequelize.TIME,
      allowNull: true,
      field: 'last_trade_time',
    },
    lastUpdated: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'last_updated',
    },
    low: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    open: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    marginPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'margin_price',
    },
    openInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'open_interest',
    },
    settlementPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'settlement_price',
    },
    side: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    strikePrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'strike_price',
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    volume: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    externalId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'external_id',
    },
    dateUnix: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'date_unix',
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updatedUnix: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'updated_unix',
    },
    updated: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    source: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    key: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    subkey: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
    {
      tableName: 'stock_options',
      timestamps: false,
      underscored: true,
    },
  )

  return StockOption
}
