
module.exports = (sequelize, Sequelize) => {
  const MsRegion = sequelize.define('MsRegion', {
    regionId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      field: 'region_id',
    },
    regionName: {
      allowNull: false,
      type: Sequelize.TEXT,
      field: 'region_name',
    },
  },
    {
      tableName: 'ms_regions',
      timestamps: false,
      underscored: true,
    },
  )

  return MsRegion
}
