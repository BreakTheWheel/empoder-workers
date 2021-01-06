
module.exports = (sequelize, Sequelize) => {
  const Fund = sequelize.define('Fund', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    portfolioPercent: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'portfolio_percent',
    },
    share: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    change: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    fillingDate: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'filling_date',
    },
  },
    {
      tableName: 'funds',
      timestamps: false,
      underscored: true,
    },
  )

  return Fund
}
