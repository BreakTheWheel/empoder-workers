
module.exports = (sequelize, Sequelize) => {
  const DailyVolume = sequelize.define('DailyVolume', {
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
    volume: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
    {
      tableName: 'daily_volume',
      timestamps: false,
      underscored: true,
    },
  )

  return DailyVolume
}
