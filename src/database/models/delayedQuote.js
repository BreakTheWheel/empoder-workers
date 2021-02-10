
module.exports = (sequelize, Sequelize) => {
  const DelayedQuote = sequelize.define('DelayedQuote', {
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    delayedPrice: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'delayed_price',
    },
    high: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    delayedSize: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'delayed_size',
    },
    delayedPriceTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'delayed_price_time',
    },
    totalVolume: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'total_volume',
    },
    processedTime: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'processed_time',
    },
  },
    {
      tableName: 'delayed_quotes',
      timestamps: false,
      underscored: true,
    },
  )

  return DelayedQuote
}
