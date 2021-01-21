
module.exports = (sequelize, Sequelize) => {
  const Signal = sequelize.define('Signal', {
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
    priceTargetId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'price_target_id',
      references: {
        model: 'price_targets',
        key: 'id',
      },
    },
    stockOptionId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'stock_option_id',
      references: {
        model: 'stock_options',
        key: 'id',
      },
    },
    fundOwnershipId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'fund_ownership_id',
      references: {
        model: 'fund_ownership',
        key: 'id',
      },
    },
    newsSentimentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'news_sentiment_id',
      references: {
        model: 'news_sentiment',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'signals',
      timestamps: false,
      underscored: true,
    },
  )

  return Signal
}
