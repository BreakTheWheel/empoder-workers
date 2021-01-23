
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
    avgTotalVolume: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'avg_total_volume',
    },
    calculationPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'calculation_price',
    },
    change: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    changePercent: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'change_percent',
    },
    close: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    closeSource: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'close_source',
    },
    closeTie: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'close_time',
    },
    companyName: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'company_name',
    },
    delayedPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'delayed_price',
    },
    delayedPriceTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'delayed_price_time',
    },
    extendedChange: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'extended_change',
    },
    extendedChangePercent: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'extended_change_percent',
    },
    extendedPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'extended_price',
    },
    extendedPriceTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'extended_price_time',
    },
    high: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    highSource: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'high_source',
    },
    highTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'high_time',
    },
    lastTradeTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'last_trade_time',
    },
    latestPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'latest_price',
    },
    latestSource: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'latest_source',
    },
    latestTime: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'latest_time',
    },
    latestUpdate: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'latest_update',
    },
    latestVolume: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'latest_volume',
    },
    low: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    lowSource: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'low_source',
    },
    lowTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'low_time',
    },
    marketCap: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'market_cap',
    },
    oddLotDelayedPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'odd_lot_delayed_price',
    },
    oddLotDelayedPriceTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'odd_lot_delayed_price_time',
    },
    open: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    openSource: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'open_source',
    },
    openTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'open_time',
    },
    peRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'pe_ratio',
    },
    previousClose: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'previous_close',
    },
    previousVolume: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'previous_volume',
    },
    primaryExchange: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'primary_exchange',
    },
    volume: {
      type: Sequelize.BIGINT,
      allowNull: true,
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
