module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'last_name',
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    uniqueId: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'unique_id',
    },
    googleId: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'google_id',
    },
    facebookId: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'facebook_id',
    },
    stripeCustomerId: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'stripe_customer_id',
    },
    subscriptionId: {
      allowNull: true,
      type: DataTypes.STRING,
      field: 'subscription_id',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true,
  })

  User.associate = models => {
    User.hasMany(models.AppleSubscription, { foreignKey: 'userId', sourceKey: 'id', as: 'appleSubscriptions' })
  }

  return User
}
