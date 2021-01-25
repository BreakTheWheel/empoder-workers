
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
    dilutedAverageSharesOutstanding: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'diluted_average_shares_outstanding',
    },
    dilutedEPS: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'diluted_eps',
    },
    ebit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    grossIncome: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'gross_income',
    },
    interestIncomeExpense: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'interest_income_expense',
    },
    netIncome: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'net_income',
    },
    netIncomeAfterTaxes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'net_income_after_taxes',
    },
    period: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    pretaxIncome: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'pretax_income',
    },
    provisionForIncomeTaxes: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'provision_for_income_taxes',
    },
    researchDevelopment: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'research_development',
    },
    revenue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    sgaExpense: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'sga_expense',
    },
    totalOperatingExpense: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'total_operating_expense',
    },
    totalOtherIncomeExpenseNet: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'total_other_income_expense_net',
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
