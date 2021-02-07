
module.exports = (sequelize, Sequelize) => {
  const SignalIncomeStatement = sequelize.define('SignalIncomeStatement', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    incomeStatementId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'income_statement_id',
      references: {
        model: 'income_statements',
        key: 'id',
      },
    },
    signalId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'signal_id',
      references: {
        model: 'signals',
        key: 'id',
      },
    },
  },
    {
      tableName: 'signal_income_statements',
      timestamps: false,
      underscored: true,
    },
  )

  SignalIncomeStatement.associate = models => {
    SignalIncomeStatement.belongsTo(models.IncomeStatement, {
      as: 'incomeStatement',
      foreignKey: 'incomeStatementId',
      targetKey: 'id',
    })
  }

  return SignalIncomeStatement
}
