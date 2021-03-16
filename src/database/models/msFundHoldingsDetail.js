
module.exports = (sequelize, Sequelize) => {
  const MsFundHoldingsDetail = sequelize.define('MsFundHoldingsDetail', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    stockSymbolId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'stock_symbol_id',
      references: {
        model: 'ms_stock_symbols',
        key: 'id',
      },
    },
    asOfDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'as_of_date',
    },
    ownerName: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'owner_name',
    },
    shareClassName: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'share_class_name',
    },
    ratingOverall: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'rating_overall',
    },
    ownerType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'owner_type',
    },
    countryId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'country_id',
    },
    secId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'sec_id',
    },
    ownerSymbol: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'owner_symbol',
    },
    numberOfShares: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_shares',
    },
    marketValue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'market_value',
    },
    shareChange: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'share_change',
    },
    percentageInPortfolio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'percentage_in_portfolio',
    },
    percentageOwnership: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'percentage_ownership',
    },
    portfolioCurrencyId: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'portfolio_currency_id',
    },
    percentChangeFromPriorPort: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'percent_change_from_prior_port',
    },
    previousPortfolioDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'previous_portfolio_date',
    },
  },
    {
      tableName: 'ms_fund_holdings_detail',
      timestamps: false,
      underscored: true,
    },
  )

  return MsFundHoldingsDetail
}
