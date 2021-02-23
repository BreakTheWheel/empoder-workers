
module.exports = (sequelize, Sequelize) => {
  const IexBalanceSheet = sequelize.define('IexBalanceSheet', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    freq: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reportDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'report_date',
    },
    filingType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'filing_type',
    },
    fiscalDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'fiscal_date',
    },
    fiscalQuarter: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'fiscal_quarter',
    },
    fiscalYear: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'fiscal_year',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    currentCash: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_cash',
    },
    shortTermInvestments: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'short_term_investments',
    },
    receivables: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    inventory: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    otherCurrentAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_current_assets',
    },
    currentAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_assets',
    },
    longTermInvestment: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'long_term_investments',
    },
    propertyPlanEquipment: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'property_plant_equipment',
    },
    goodwill: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    intangibleAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'intangible_assets',
    },
    otherAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_assets',
    },
    totalAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_assets',
    },
    accountsPayable: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'accounts_payable',
    },
    currentLongTermDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_long_term_debt',
    },
    otherCurrentLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_current_liabilities',
    },
    longTermDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'long_term_debt',
    },
    otherLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_liabilities',
    },
    minorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'minority_interest',
    },
    totalLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_liabilities',
    },
    commonStock: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'common_stock',
    },
    retainedEarnings: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'common_stock',
    },
    treasuryStock: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'treasury_stock',
    },
    capitalSurplus: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'capital_surplus',
    },
    shareholderEquity: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'shareholder_equity',
    },
    netTangibleAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_tangible_assets',
    },
    date: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    updated: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
  },
    {
      tableName: 'iex_balance_sheets',
      timestamps: false,
      underscored: true,
    },
  )

  return IexBalanceSheet
}
