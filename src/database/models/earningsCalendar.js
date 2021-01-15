
module.exports = (sequelize, Sequelize) => {
  const EarningsCalendar = sequelize.define('EarningsCalendar', {
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
    hour: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    epsActual: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'eps_actual',
    },
    epsEstimate: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'eps_actual',
    },
    revenueActual: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'revenue_actual',
    },
    revenueEstimate: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'revenue_estimate',
    },
    quarter: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
    {
      tableName: 'earnings_calendar',
      timestamps: false,
      underscored: true,
    },
  )

  return EarningsCalendar
}
