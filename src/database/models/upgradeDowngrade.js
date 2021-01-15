
module.exports = (sequelize, Sequelize) => {
  const UpgradeDowngrade = sequelize.define('UpgradeDowngrade', {
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
    company: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fromGrade: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'from_grade',
    },
    toGrade: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'from_grade',
    },
    gradeTime: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'grade_time',
    },
  },
    {
      tableName: 'upgrade_downgrade',
      timestamps: false,
      underscored: true,
    },
  )

  return UpgradeDowngrade
}
