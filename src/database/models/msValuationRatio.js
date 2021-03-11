
module.exports = (sequelize, Sequelize) => {
  const MsValuationRatio = sequelize.define('MsValuationRatio', {
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
      allowNull: true,
      field: 'as_of_date',
    },
    salesPerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'sales_per_share',
    },
    growthAnnSalesPerShare5Year: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'growth_ann_sales_per_share_5_year',
    },
    bookValuePerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'book_value_per_share',
    },
    fcfPerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'fcf_per_share',
    },
    priceToEps: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_eps',
    },
    ratioPE5YearHigh: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ratio_pe_5_year_high',
    },
    ratioPE5YearLow: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ratio_pe_5_year_low',
    },
    priceToBook: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_book',
    },
    priceToSales: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_sales',
    },
    priceToCashFlow: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_cash_flow',
    },
    priceToFreeCashFlow: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_free_cash_flow',
    },
    divRate: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'div_rate',
    },
    dividendYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'dividend_yield',
    },
    divPayoutTotOps: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'div_payout_to_ops',
    },
    divPayout5Year: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'div_payout_5_year',
    },
    divYield5Year: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'div_yield_5_year',
    },
    payoutRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'payout_ratio',
    },
    sustainableGrowthRate: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'sustainable_growth_rate',
    },
    cashReturn: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cash_return',
    },
    forwardEarningYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'forward_earning_yield',
    },
    pegRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'peg_ratio',
    },
    pegPayback: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'peg_payback',
    },
    forwardDividendYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'forward_dividend_yield',
    },
    forwardPERatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'forward_pe_ratio',
    },
    tangibleBookValuePerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'tangible_book_value_per_share',
    },
    tangibleBbPerShare3YrAvg: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'tangible_bv_per_share_3_yr_avg',
    },
    tangibleBbPerShare5YrAvg: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'tangible_bv_per_share_5_yr_avg',
    },
    evToEbitda: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_ebitda',
    },
    ratioPe5YearAverage: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ratio_pe_5_year_average',
    },
    normalizedPeRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'normalized_pe_ratio',
    },
    fcfYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'fcf_yield',
    },
    evToForwardEBIT: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_forward_ebit',
    },
    evToForwardEbitda: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_forward_ebitda',
    },
    evToForwardRevenue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_forward_revenue',
    },
    twoYearsEvToForwardEbit: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'two_years_ev_to_forward_ebit',
    },
    twoYearsEvToForwardEbitda: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'two_years_ev_to_forward_ebida',
    },
    firstYearEstimatedEpsGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'first_year_estimated_eps_growth',
    },
    secondYearEstimatedEpsGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'second_year_estimated_eps_growth',
    },
    normalizedPeg: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'normalized_peg',
    },
    earningYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'earning_yield',
    },
    salesYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'sales_yield',
    },
    bookValueYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'book_value_yield',
    },
    cashFlowYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cash_flow_yield',
    },
    workingCapitalPerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'working_capital_per_share',
    },
    workingCapitalPerShare3YrAvg: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'working_capital_per_share_3_yr_avg',
    },
    workingCapitalPerShare5YrAvg: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'working_capital_per_share_5_yr_avg',
    },
    buyBackYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'buy_back_yield',
    },
    totalYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_yield',
    },
    priceToEbitda: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_ebitda',
    },
    forwardRoe: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'forward_roe',
    },
    forwardRoa: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'forward_roa',
    },
    twoYearsForwardEarningYield: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'two_years_forward_earning_yield',
    },
    twoYearsForwardPERatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'two_years_forward_pe_ratio',
    },
    totalAssetPerShare: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_asset_per_share',
    },
    evtoRevenue: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_revenue',
    },
    evtoPreTaxIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_pre_tax_income',
    },
    evtoTotalAssets: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_total_assets',
    },
    evToFcf: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_fcf',
    },
    evToEbit: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'ev_to_ebit',
    },
    pricetoCashRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'price_to_cash_ratio',
    },
    capeRatio: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cape_ratio',
    },
  },
    {
      tableName: 'ms_valuation_ratios',
      timestamps: false,
      underscored: true,
    },
  )

  return MsValuationRatio
}
