
module.exports = (sequelize, Sequelize) => {
  const PriceTarget = sequelize.define('PriceTarget', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
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
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
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
