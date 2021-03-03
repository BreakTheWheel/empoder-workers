
module.exports = (sequelize, Sequelize) => {
  const MsExchange = sequelize.define('MsExchange', {
    exchangeId: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      field: 'exchange_id',
    },
    exchangeName: {
      type: Sequelize.TEXT,
      allowNull: false,
      field: 'exchange_name',
    },
    mic: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    regionId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'region_id',
      references: {
        model: 'ms_regions',
        key: 'region_id',
      },
    },
    regionName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'region_name',
    },
    countryId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'country_id',
    },
    countryName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'country_name',
    },
  },
    {
      tableName: 'ms_exchanges',
      timestamps: false,
      underscored: true,
    },
  )

  return MsExchange
}
