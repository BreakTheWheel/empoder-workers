
module.exports = (sequelize, Sequelize) => {
  const NewsArticle = sequelize.define('NewsArticle', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    datetime: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    headline: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    image: {
      allowNull: false,
      type: Sequelize.STRING,
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
    lang: {
      allowNull: true,
      type: Sequelize.STRING,
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
