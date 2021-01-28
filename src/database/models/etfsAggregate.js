
module.exports = (sequelize, Sequelize) => {
  const EtfsAggregate = sequelize.define('EtfsAggregate', {
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
        key: 'id',
      },
    },
    totalShares: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'total_shares',
    },
    totalValue: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'total_value',
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
    {
      tableName: 'etfs_aggregates',
      timestamps: false,
      underscored: true,
    },
  )

  return EtfsAggregate
}
