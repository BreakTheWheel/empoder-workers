
module.exports = (sequelize, Sequelize) => {
  const EtfsHolding = sequelize.define('EtfsHolding', {
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
    atDate: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'at_date',
    },
    active: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
    {
      tableName: 'etfs_holdings',
      timestamps: false,
      underscored: true,
    },
  )

  return EtfsHolding
}
