
module.exports = (sequelize, Sequelize) => {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uniqueId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      field: 'unique_id',
    },
    number: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    subscriptionId: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      field: 'subscription_id',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'phone_numbers',
      timestamps: false,
      underscored: true,
    },
  )

  return PhoneNumber
}
