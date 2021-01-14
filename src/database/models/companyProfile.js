
module.exports = (sequelize, Sequelize) => {
  const CompanyProfile = sequelize.define('CompanyProfile', {
    ticker: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    city: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    country: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cusip: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    sedol: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    employeeTotal: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'employee_total',
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ggroup: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gind: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gsector: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gsubind: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ipo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    marketCapitalization: {
      type: Sequelize.BIGINT,
      allowNull: true,
      field: 'market_capitalization',
    },
    naics: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    naicsSector: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'naics_sector',
    },
    naicsSubsector: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'naics_subsector',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    shareOutstanding: {
      type: Sequelize.FLOAT,
      allowNull: true,
      field: 'share_outstanding',
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    weburl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    finnhubIndustry: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'finnhub_industry',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at',
    },
  },
    {
      tableName: 'company_profiles',
      timestamps: true,
      underscored: true,
    },
  )

  return CompanyProfile
}
