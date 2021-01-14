
module.exports = (sequelize, Sequelize) => {
  const Peer = sequelize.define('Peer', {
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    peerSymbol: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'peer_symbol',
      primaryKey: true,
    },
  },
    {
      tableName: 'peers',
      timestamps: false,
      underscored: true,
    },
  )

  return Peer
}
