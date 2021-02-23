
module.exports = (sequelize, Sequelize) => {
  const IexIncomeStatement = sequelize.define('IexIncomeStatement', {
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
    totalRevenue: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'total_revenue',
    },
    costOfRevenue: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'cost_of_revenue',
    },
    grossProfit: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'gross_profit',
    },
    researchAndDevelopment: {
      type: Sequelize.FLOAT,
      allowNull: false,
      field: 'research_and_development',
    },
    sellingGeneratelAndAdmin: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'selling_general_and_admin',
    },
    operatingExpense: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'operating_expense',
    },
    operatingIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'operating_income',
    },
    otherIncomeExpenseNet: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_income_expense_net',
    },
    ebit: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    interestIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'interest_income',
    },
    pretaxIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'pretax_income',
    },
    incomeTax: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'income_tax',
    },
    minorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'minority_interest',
    },
    netIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_income',
    },
    netIncomeBasic: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_income_basic',
    },
  },
    {
      tableName: 'iex_income_statements',
      timestamps: false,
      underscored: true,
    },
  )

  return IexIncomeStatement
}
