
module.exports = (sequelize, Sequelize) => {
  const IncomeStatement = sequelize.define('IncomeStatement', {
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
    costOfGoodsSold: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'cost_of_goods_sold',
    },
    depreciationAmortization: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'depreciation_amortization',
    },
    dilutedAverageSharesOutstanding: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'diluted_average_shares_outstanding',
    },
    dilutedEPS: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'diluted_eps',
    },
    ebit: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    minorityInterest: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'minority_interest',
    },
    grossIncome: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'gross_income',
    },
    interestIncomeExpense: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'interest_income_expense',
    },
    otherOperatingExpensesTotal: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'other_operating_expenses_total',
    },
    netIncome: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'net_income',
    },
    netIncomeAfterTaxes: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'net_income_after_taxes',
    },
    period: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    pretaxIncome: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'pretax_income',
    },
    provisionForIncomeTaxes: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'provision_for_income_taxes',
    },
    researchDevelopment: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'research_development',
    },
    revenue: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    sgaExpense: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'sga_expense',
    },
    totalOperatingExpense: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_operating_expense',
    },
    totalOtherIncomeExpenseNet: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'total_other_income_expense_net',
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    freq: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'quarterly',
    },
  },
    {
      tableName: 'income_statements',
      timestamps: false,
      underscored: true,
    },
  )

  return IncomeStatement
}
