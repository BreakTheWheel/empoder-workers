
module.exports = (sequelize, Sequelize) => {
  const SignalEtfsAggregate = sequelize.define('SignalEtfsAggregate', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    etfsAggregateId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'etfs_aggregate_id',
      references: {
        model: 'etfs_aggregates',
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
      tableName: 'signal_etfs_aggregates',
      timestamps: false,
      underscored: true,
    },
  )

  SignalEtfsAggregate.associate = models => {
    SignalEtfsAggregate.belongsTo(models.EtfsAggregate, {
      as: 'etfsAggregate',
      foreignKey: 'etfsAggregateId',
      targetKey: 'id',
    })
  }

  return SignalEtfsAggregate
}
