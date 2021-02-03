
module.exports = (sequelize, Sequelize) => {
  const StockSymbol = sequelize.define('StockSymbol', {
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    displaySymbol: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'display_symbol',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    exchange: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tracking: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sectorId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'sector_id',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'stock_symbols',
      timestamps: false,
      underscored: true,
    },
  )

  StockSymbol.associate = models => {
    StockSymbol.hasMany(models.Peer, { foreignKey: 'symbol', sourceKey: 'symbol', as: 'peers' })
  }

  return StockSymbol
}
