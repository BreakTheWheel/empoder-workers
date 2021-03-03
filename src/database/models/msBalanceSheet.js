
module.exports = (sequelize, Sequelize) => {
  const MsBalanceSheet = sequelize.define('MsBalanceSheet', {
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
        model: 'ms_stock_symbols',
        key: 'symbol',
      },
    },
    reportDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'report_date',
    },
    periodEndingDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'period_ending_date',
    },
    fileDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'file_date',
    },
    statementType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'statement_type',
    },
    dataType: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'data_type',
    },
    currencyId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'currency_id',
    },
    fiscalYearEnd: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'fiscal_year_end',
    },
    accountsPayable: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'accounts_payable',
    },
    accountsReceivable: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'accounts_receivable',
    },
    currentAccruedExpenses: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_accrued_expenses',
    },
    accumulatedDepreciation: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'accumulated_depreciation',
    },
    gainsLossesNotAffectingRetainedEarnings: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'gainsLosses_not_affecting_retained_earnings',
    },
    buildingsAndImprovements: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'buildings_and_improvements',
    },
    capitalStock: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'capital_stock',
    },
    cash: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    cashAndCashEquivalents: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cash_and_cash_equivalents',
    },
    cashCashEquivalentsAndShortTermInvestments: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cash_cash_equivalents_and_short_term_investment',
    },
    commonStock: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'common_stock',
    },
    commonStockEquity: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'common_stock_equity',
    },
    constructionInProgress: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'construction_in_progress',
    },
    currentAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_assets',
    },
    currentDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_debt',
    },
    currentDebtAndCapitalLeaseObligation: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_debt_and_capital_lease_obligation',
    },
    currentLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_liabilities',
    },
    currentCapitalLeaseObligation: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'current_capital_lease_obligation',
    },
    nonCurrentDeferredLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'non_current_deferred_liabilities',
    },
    nonCurrentDeferredTaxesAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'non_current_deferred_taxes_assets',
    },
    nonCurrentDeferredTaxesLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'non_current_deferred_taxes_liabilities',
    },
    finishedGoods: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'finished_goods',
    },
    goodwill: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    goodwillAndOtherIntangibleAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'goodwill_and_other_intangible_assets',
    },
    grossPpe: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'gross_ppe',
    },
    incomeTaxPayable: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'income_tax_payable',
    },
    inventory: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    investmentsAndAdvances: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'investments_and_advances',
    },
    landAndImprovements: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'land_and_improvements',
    },
    longTermDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'long_term_debt',
    },
    longTermDebtAndCapitalLeaseObligation: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'long_term_debt_and_capital_lease_obligation',
    },
    longTermCapitalLeaseObligation: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'long_term_capital_lease_obligation',
    },
    machineryFurnitureEquipment: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'machinery_furniture_equipment',
    },
    minorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'minority_interest',
    },
    netPpe: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_ppe',
    },
    nonCurrentNoteReceivables: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'non_current_note_receivables',
    },
    otherCurrentBorrowings: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_current_borrowings',
    },
    otherCurrentLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_current_liabilities',
    },
    otherIntangibleAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_intangible_assets',
    },
    otherInventories: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_inventories',
    },
    otherNonCurrentAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_non_current_assets',
    },
    otherProperties: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_properties',
    },
    payables: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    payablesAndAccruedExpenses: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'payables_and_accrued_expenses',
    },
    preferredSecuritiesOutsideStockEquity: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'preferred_securities_out_side_stock_equity',
    },
    prepaidAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'prepaid_assets',
    },
    properties: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    rawMaterials: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'raw_materials',
    },
    receivables: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    retainedEarnings: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'retained_earnings',
    },
    stockholdersEquity: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'stockholders_equity',
    },
    totalTaxPayable: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_tax_payable',
    },
    totalAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_assets',
    },
    totalCapitalization: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_capitalization',
    },
    totalNonCurrentAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_non_current_assets',
    },
    treasuryStock: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'treasury_stock',
    },
    workInProcess: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'work_in_progress',
    },
    otherNonCurrentLiabilities: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_non_current_liabilities',
    },
    capitalLeaseObligations: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'capital_lease_obligations',
    },
    shareIssued: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'share_issued',
    },
    investedCapital: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'invested_capital',
    },
    tangibleBookValue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'tangible_book_value',
    },
    totalEquity: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_equity',
    },
    workingCapital: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'working_capital',
    },
    totalDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_debt',
    },
    nonCurrentDeferredAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'non_current_deferred_assets',
    },
    ordinarySharesNumber: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ordinary_shares_number',
    },
    treasurySharesNumber: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'treasury_shares_number',
    },
    totalLiabilitiesNetMinorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_liabilities_net_minority_interest',
    },
    totalNonCurrentLiabilitiesNetMinorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_non_current_liabilities_net_minority_interest',
    },
    totalEquityGrossMinorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_equity_gross_minority_interest',
    },
    netTangibleAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_tangible_assets',
    },
    totalLiabilitiesAsReported: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_liabilities_as_reported',
    },
    totalEquityAsReported: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_equity_as_reported',
    },
    netDebt: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_debt',
    },
  },
    {
      tableName: 'ms_balance_sheets',
      timestamps: false,
      underscored: true,
    },
  )

  return MsBalanceSheet
}
