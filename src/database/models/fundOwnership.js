
module.exports = (sequelize, Sequelize) => {
  const FundOwnership = sequelize.define('FundOwnership', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fundId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'fund_id',
      references: {
        model: 'funds',
        key: 'id',
      },
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
    filingDate: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'filing_date',
    },
  },
    {
      tableName: 'fund_ownership',
      timestamps: false,
      underscored: true,
    },
  )

  return FundOwnership
}
