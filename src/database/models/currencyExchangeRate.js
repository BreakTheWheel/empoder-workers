
module.exports = (sequelize, Sequelize) => {
  const CurrencyExchangeRate = sequelize.define('CurrencyExchangeRate', {
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    exchangeRateToUsd: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'exchange_rate_to_usd',
    },
  },
    {
      tableName: 'currency_exchange_rates',
      timestamps: false,
      underscored: true,
    },
  )

  return CurrencyExchangeRate
}
