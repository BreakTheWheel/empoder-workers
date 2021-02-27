
module.exports = (sequelize, Sequelize) => {
  const StockNewsArticle = sequelize.define('StockNewsArticle', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    newsUrl: {
      allowNull: false,
      type: Sequelize.TEXT,
      field: 'news_url',
    },
    imageUrl: {
      allowNull: false,
      type: Sequelize.TEXT,
      field: 'image_url',
    },
    title: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    text: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    sourceName: {
      allowNull: false,
      type: Sequelize.TEXT,
      field: 'source_name',
    },
    date: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    topics: {
      allowNull: true,
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    tickers: {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    sentiment: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    type: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
  },
    {
      tableName: 'stock_news_articles',
      timestamps: false,
      underscored: true,
    },
  )

  return StockNewsArticle
}
