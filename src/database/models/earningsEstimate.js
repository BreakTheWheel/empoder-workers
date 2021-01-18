
module.exports = (sequelize, Sequelize) => {
  const EarningsEstimate = sequelize.define('EarningsEstimate', {
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
    epsAvg: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'eps_avg',
    },
    epsHigh: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'eps_high',
    },
    epsLow: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'eps_low',
    },
    numberAnalysts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'number_analysts',
    },
    period: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
    {
      tableName: 'earnings_estimates',
      timestamps: false,
      underscored: true,
    },
  )

  return EarningsEstimate
}
