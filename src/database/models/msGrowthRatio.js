
module.exports = (sequelize, Sequelize) => {
  const MsGrowthRatio = sequelize.define('MsGrowthRatio', {
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
    reportDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'report_date',
    },
    periodEndingDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'period_ending_date',
    },
    fileDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'file_date',
    },
    statementType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'statement_type',
    },
    dataType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'data_type',
    },
    fiscalYearEnd: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'fiscal_year_end',
    },
    dilutedEps1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'diluted_eps_1_year_growth',
    },
    dilutedContinuousEps1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'diluted_continuous_eps_1_year_growth',
    },
    dividend1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'dividend_1_year_growth',
    },
    equityPerShare1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'equity_per_share_1_year_growth',
    },
    revenue1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'revenue_1_year_growth',
    },
    operatingIncome1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'operating_income_1_year_growth',
    },
    netIncome1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_income_1_year_growth',
    },
    netIncomeContOps1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_income_cont_ops_1_year_growth',
    },
    cfo1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'cfo_1_year_growth',
    },
    fcf1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'fcf_1_year_growth',
    },
    operatingRevenue1YearGrowth: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'operating_revenue_1_year_growth',
    },
    accessionNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'accession_number',
    },
    formType: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'form_type',
    },
    normalizedDilutedEpsGrowth1year: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'normalized_diluted_eps_growth_1_year',
    },
    normalizedBasicEpsGrowth1year: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'normalized_basic_eps_growth_1_year',
    },
  },
    {
      tableName: 'ms_growth_ratios',
      timestamps: false,
      underscored: true,
    },
  )

  return MsGrowthRatio
}
