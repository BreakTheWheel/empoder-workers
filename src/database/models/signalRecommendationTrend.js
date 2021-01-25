
module.exports = (sequelize, Sequelize) => {
  const SignalRecommendationTrend = sequelize.define('SignalRecommendationTrend', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    recommendationTrendId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'recommendation_trend_id',
      references: {
        model: 'recommendation_trends',
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
      tableName: 'signal_recommendation_trends',
      timestamps: false,
      underscored: true,
    },
  )

  return SignalRecommendationTrend
}
