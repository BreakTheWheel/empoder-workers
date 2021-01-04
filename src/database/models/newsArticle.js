
module.exports = (sequelize, Sequelize) => {
  const NewsArticle = sequelize.define('NewsArticle', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    datetime: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    headline: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    newsId: {
      allowNull: false,
      type: Sequelize.STRING,
      field: 'news_id',
    },
    image: {
      allowNull: false,
      type: Sequelize.STRING,
      field: 'news_id',
    },
    related: {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    source: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    summary: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    url: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
  },
    {
      tableName: 'news_articles',
      timestamps: false,
      underscored: true,
    },
  )

  return NewsArticle
}
