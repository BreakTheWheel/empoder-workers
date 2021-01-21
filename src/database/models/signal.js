
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
    buzzRatioId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'buzz_ratio_id',
      references: {
        model: 'news_sentiment',
        key: 'id',
      },
    },
    buzzIndexId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'buzz_index_id',
      references: {
        model: 'news_sentiment',
        key: 'id',
      },
    },
    quarterlyRevenueId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'quarterly_revenue_id',
      references: {
        model: 'company_basic_financials',
        key: 'id',
      },
    },
    yearlyRevenueId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'yearly_revenue_id',
      references: {
        model: 'company_basic_financials',
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
