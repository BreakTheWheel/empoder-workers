
module.exports = (sequelize, Sequelize) => {
  const MsIncomeStatement = sequelize.define('MsIncomeStatement', {
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
      allowNull: false,
      type: Sequelize.DATE,
      field: 'report_date',
    },
    periodEndingDate: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'period_ending_date',
    },
    fileDate: {
      allowNull: true,
      type: Sequelize.DATE,
      field: 'file_date',
    },
    statementType: {
      allowNull: true,
      type: Sequelize.STRING,
      field: 'statement_type',
    },
    dataType: {
      allowNull: true,
      type: Sequelize.STRING,
      field: 'data_type',
    },
    currencyId: {
      allowNull: true,
      type: Sequelize.STRING,
      field: 'currency_id',
    },
    fiscalYearEnd: {
      allowNull: false,
      type: Sequelize.INTEGER,
      field: 'fiscal_year_end',
    },
    amortization: {
      allowNull: true,
      type: Sequelize.FLOAT,
    },
    costOfRevenue: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'cost_of_revenue',
    },
    depreciationAndAmortization: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'depreciation_and_amortization',
    },
    depreciationAmortizationDepletion: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'depreciation_amortization_depletion',
    },
    earningsFromEquityInterest: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'earinings_from_equity_interest',
    },
    exciseTaxes: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'excise_taxes',
    },
    gainOnSaleOfPpe: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'gain_on_sale_of_ppe',
    },
    gainOnSaleOfSecurity: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'gain_on_sale_of_security',
    },
    generalAndAdministrationExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'general_and_administration_expense',
    },
    grossProfit: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'gross_profit',
    },
    interestExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'interest_expense',
    },
    interestExpenseNonOperating: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'interest_expense_non_operating',
    },
    interestIncomeNonOperating: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'interest_income_non_operating',
    },
    netNonOperatingInterestIncomeExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_non_perating_interest_income_expense',
    },
    netIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_income',
    },
    netIncomeCommonStockHolders: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_income_common_stock_holders',
    },
    netIncomeContinuousOperations: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_income_continuous_operations',
    },
    netInterestIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_interest_income',
    },
    totalRevenue: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_revenue',
    },
    operatingExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'operating_expense',
    },
    operatingIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'operating_income',
    },
    operatingRevenue: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'operating_revenue',
    },
    otherIncomeExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'other_income_expense',
    },
    otherSpecialCharges: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'other_special_charges',
    },
    pretaxIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'pretax_income',
    },
    taxProvision: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'tax_provision',
    },
    rentAndLandingFees: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'rent_and_landing_fees',
    },
    researchAndDevelopment: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'resaerch_and_development',
    },
    restructuringAndMergernAcquisition: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'restructuring_and_mergern_acquisition',
    },
    salariesAndWages: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'salaries_and_wages',
    },
    sellingAndMarketingExpense: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'selling_and_marketing_expense',
    },
    sellingGeneralAndAdministration: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'selling_general_and_administration',
    },
    specialIncomeCharges: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'special_income_charges',
    },
    totalExpenses: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_expenses',
    },
    amortizationOfIntangibles: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'amortization_of_intangibles',
    },
    interestIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'interest_income',
    },
    netIncomeFromContinuingAndDiscontinuedOperation: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_income_from_continuing_and_discontinued_operation',
    },
    reconciledCostOfRevenue: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'reconciled_cost_of_revenue',
    },
    reconciledDepreciation: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'reconciled_depreciation',
    },
    earningBeforeInterestAndTax: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'earning_before_interest_and_tax',
    },
    normalizedIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'normalized_income',
    },
    ebitda: {
      allowNull: true,
      type: Sequelize.FLOAT,
    },
    basicContinuousOperations: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'basic_continuous_operations',
    },
    basicEps: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'basic_eps',
    },
    dilutedContinuousOperations: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'diluted_continuous_operations',
    },
    dilutedEps: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'diluted_eps',
    },
    basicAverageShares: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'basic_average_shares',
    },
    dilutedAverageShares: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'diluted_average_shares',
    },
    continuingAndDiscontinuedBasicEPS: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'continuing_and_discontinued_basic_eps',
    },
    continuingAndDiscontinuedDilutedEPS: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'continuing_and_discontinued_diluted_eps',
    },
    netIncomeFromContinuingOperationNetMinorityInterest: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'netIncome_from_continuing_operation_net_minority_interest',
    },
    accessionNumber: {
      allowNull: true,
      type: Sequelize.STRING,
      field: 'accession_number',
    },
    formType: {
      allowNull: true,
      type: Sequelize.STRING,
      field: 'form_type',
    },
    netIncomeIncludingNoncontrollingInterests: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'net_income_including_non_controlling_interests',
    },
    otherNonOperatingIncomeExpenses: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'other_non_operating_income_expenses',
    },
    totalUnusualItems: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_unusual_items',
    },
    totalUnusualItemsExcludingGoodwill: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_unusual_items_excluding_goodwill',
    },
    taxRateForCalcs: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'tax_rate_for_calcs',
    },
    calculatedTaxEffectOfUnusualItems: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'calculated_tax_effect_of_unusual_items',
    },
    normalizedBasicEps: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'normalized_basic_eps',
    },
    normalizedDilutedEps: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'normalized_diluted_eps',
    },
    fiscalYearChange: {
      allowNull: true,
      type: Sequelize.INTEGER,
      field: 'fiscal_year_change',
    },
    otherGandA: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'other_gand_a',
    },
    totalOperatingIncomeAsReported: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_operating_income_as_reported',
    },
    rentExpenseSupplemental: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'rent_expense_supplemental',
    },
    normalizedPretaxIncome: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'normalized_pretax_income',
    },
    totalRevenueAsReported: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'total_revenue_as_reported',
    },
    operatingExpenseAsReported: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'operating_expense_as_reported',
    },
    normalizedEbitda: {
      allowNull: true,
      type: Sequelize.FLOAT,
      field: 'normalized_ebitda',
    },
  },
    {
      tableName: 'ms_income_statements',
      timestamps: false,
      underscored: true,
    },
  )

  return MsIncomeStatement
}
