
module.exports = (sequelize, Sequelize) => {
  const SignalPriceTarget = sequelize.define('SignalPriceTarget', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    priceTargetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'price_target_id',
      references: {
        model: 'price_targets',
        key: 'id',
      },
    },
    signalId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'signal_id',
      references: {
        model: 'signals',
        key: 'id',
      },
    },
  },
    {
      tableName: 'signal_price_targets',
      timestamps: false,
      underscored: true,
    },
  )

  SignalPriceTarget.associate = models => {
    SignalPriceTarget.belongsTo(models.PriceTarget, {
      as: 'priceTarget',
      foreignKey: 'priceTargetId',
      targetKey: 'id',
    })
  }

  return SignalPriceTarget
}
