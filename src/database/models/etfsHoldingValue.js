
module.exports = (sequelize, Sequelize) => {
  const EtfsHoldingValue = sequelize.define('EtfsHoldingValue', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    etfsHoldingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'etfs_holding_id',
      references: {
        model: 'etfs_holdings',
        key: 'id',
      },
    },
    holdsSymbol: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'holds_symbol',
    },
    cusip: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    share: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    percent: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
  },
    {
      tableName: 'etfs_holding_values',
      timestamps: false,
      underscored: true,
    },
  )

  return EtfsHoldingValue
}
