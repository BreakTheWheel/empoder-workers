
module.exports = (sequelize, Sequelize) => {
  const MsFundHoldingsSummary = sequelize.define('MsFundHoldingsSummary', {
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
    numberOfOwners: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_owners',
    },
    totalSharesOwned: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_shares_owned',
    },
    totalMarketValue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_market_value',
    },
    numberOfNewOwners: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_new_owners',
    },
    totalSharesBoughtByNewOwners: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_shares_bought_by_new_owners',
    },
    numberOfSoldOutOwners: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_sold_out_owners',
    },
    totalSharesSoldOut: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_shares_sold_out',
    },
    numberOfExistingOwnerBuying: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_existing_owner_buying',
    },
    totalSharesBought: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_shares_bought',
    },
    numberOfExistingOwnerSelling: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'number_of_existing_owner_selling',
    },
    totalSharesSold: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_shares_sold',
    },
  },
    {
      tableName: 'ms_fund_holdings_summary',
      timestamps: false,
      underscored: true,
    },
  )

  return MsFundHoldingsSummary
}
