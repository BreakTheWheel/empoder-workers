
module.exports = (sequelize, Sequelize) => {
  const PriceTarget = sequelize.define('PriceTarget', {
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
    targetHigh: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'target_high',
    },
    targetLow: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'target_low',
    },
    targetMean: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'target_mean',
    },
    targetMedian: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'target_median',
    },
    lastUpdated: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'last_updated',
    },
  },
    {
      tableName: 'price_targets',
      timestamps: false,
      underscored: true,
    },
  )

  return PriceTarget
}
