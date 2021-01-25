
module.exports = (sequelize, Sequelize) => {
  const RecommendationTrend = sequelize.define('RecommendationTrend', {
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
    buy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sell: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    strongBuy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'strong_buy',
    },
    strongSell: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'strong_sell',
    },
    hold: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    period: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
    {
      tableName: 'recommendation_trends',
      timestamps: false,
      underscored: true,
    },
  )

  return RecommendationTrend
}
