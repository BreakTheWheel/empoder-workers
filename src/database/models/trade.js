
module.exports = (sequelize, Sequelize) => {
  const Trade = sequelize.define('Trade', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    volume: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    timestamp: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    unixTimestampMs: {
      allowNull: false,
      type: Sequelize.BIGINT,
      field: 'unix_timestamp_ms',
    },
    conditions: {
      allowNull: true,
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
  },
    {
      tableName: 'trades',
      timestamps: false,
      underscored: true,
    },
  )

  return Trade
}
