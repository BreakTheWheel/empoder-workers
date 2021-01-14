
module.exports = (sequelize, Sequelize) => {
  const Fund = sequelize.define('Fund', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
  },
    {
      tableName: 'funds',
      timestamps: false,
      underscored: true,
    },
  )

  return Fund
}
