
module.exports = (sequelize, Sequelize) => {
  const BalanceSheet = sequelize.define('BalanceSheet', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    accountsPayable: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'accounts_payable',
    },
    accountsReceivables: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'accounts_receivables',
    },
    accruedLiability: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'accrued_liability',
    },
    accumulatedDepreciation: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'accumulated_depreciation',
    },
    cash: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    cashEquivalents: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cash_equivalents',
    },
    cashShortTermInvestments: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'cash_short_term_investments',
    },
    commonStock: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'common_stock',
    },
    currentAssets: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'current_assets',
    },
    currentLiabilities: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'current_liabilities',
    },
    currentPortionLongTermDebt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'current_portion_long_term_debt',
    },
    deferredIncomeTax: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'deferred_income_tax',
    },
    goodwill: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    intangiblesAssets: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'intangibles_assets',
    },
    inventory: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    liabilitiesShareholdersEquity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'liabilities_shareholders_equity',
    },
    longTermDebt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'long_term_debt',
    },
    longTermInvestments: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'long_term_investments',
    },
    nonRedeemablePreferredStock: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'non_redeemable_preferred_stock',
    },
    otherCurrentAssets: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_current_assets',
    },
    otherCurrentLiabilities: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_current_liabilities',
    },
    otherEquity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_equity',
    },
    otherLiabilities: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_liabilities',
    },
    otherLongTermAssets: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_long_term_assets',
    },
    otherReceivables: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'other_receivables',
    },
    period: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    preferredSharesOutstanding: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'preferred_shares_outstanding',
    },
    propertyPlantEquipment: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'property_plant_equipment',
    },
    retainedEarnings: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'retained_earnings',
    },
    sharesOutstanding: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'shares_outstanding',
    },
    shortTermDebt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'short_term_debt',
    },
    shortTermInvestments: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'short_term_investments',
    },
    tangibleBookValueperShare: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'tangible_book_valueper_share',
    },
    totalAssets: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_assets',
    },
    totalDebt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_debt',
    },
    totalEquity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_equity',
    },
    totalLiabilities: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_liabilities',
    },
    totalLongTermDebt: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_long_term_debt',
    },
    totalReceivables: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_receivables',
    },
    freq: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    unrealizedProfitLossSecurity: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'unrealized_profit_loss_security',
    },
  },
    {
      tableName: 'balance_sheets',
      timestamps: false,
      underscored: true,
    },
  )

  return BalanceSheet
}
