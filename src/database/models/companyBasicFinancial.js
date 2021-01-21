
module.exports = (sequelize, Sequelize) => {
  const CompanyBasicFinancial = sequelize.define('CompanyBasicFinancial', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'stock_symbols',
        key: 'symbol',
      },
    },
    basicFinancials: {
      type: Sequelize.JSONB,
      allowNull: true,
      field: 'basic_financials',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'company_basic_financials',
      timestamps: false,
      underscored: true,
    },
  )

  return CompanyBasicFinancial
}
