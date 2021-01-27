
module.exports = (sequelize, Sequelize) => {
  const NewsSentiment = sequelize.define('NewsSentiment', {
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
    articlesInLastWeek: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'articles_in_last_week',
    },
    buzz: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    weeklyAverage: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'weekly_average',
    },
    companyNewsScore: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'company_news_score',
    },
    sectorAverageBullishPercent: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'sector_average_bullish_percent',
    },
    sectorAverageNewsScore: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'sector_average_news_score',
    },
    bearishPercent: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'bearish_percent',
    },
    bullishPercent: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'bullish_percent',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'news_sentiment',
      timestamps: false,
      underscored: true,
    },
  )

  return NewsSentiment
}
