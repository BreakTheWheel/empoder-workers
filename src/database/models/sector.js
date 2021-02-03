
module.exports = (sequelize, Sequelize) => {
  const Sector = sequelize.define('Sector', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
    {
      tableName: 'sectors',
      timestamps: false,
      underscored: true,
    },
  )

  return Sector
}
