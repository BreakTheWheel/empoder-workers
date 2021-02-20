
module.exports = (sequelize, Sequelize) => {
  const BarchartOption = sequelize.define('BarchartOption', {
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
    code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    strike: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    expirationDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'expiration_date',
    },
    expirationType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'expiration_type',
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    volatility: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    delta: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    gama: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    theta: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    vega: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    rho: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    bidSize: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'bid_size',
    },
    bidDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'bid_date',
    },
    ask: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'bid_size',
    },
    askSize: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'bid_size',
    },
    askDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'ask_date',
    },
    open: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    high: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    low: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    last: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    previous: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    change: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    percentChange: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'percent_change',
    },
    premium: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    settlment: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    lastTradeDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'last_trade_date',
    },
    volume: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    openInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'open_interest',
    },
    period: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
    {
      tableName: 'barchart_options',
      timestamps: false,
      underscored: true,
    },
  )

  return BarchartOption
}
