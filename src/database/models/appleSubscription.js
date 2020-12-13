
module.exports = (sequelize, Sequelize) => {
  const AppleSubscription = sequelize.define('AppleSubscription', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    expiresDateMs: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'expires_date_ms',
    },
    isInIntroOfferPeriod: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      field: 'is_in_intro_offer_period',
    },
    isTrialPeriod: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      field: 'is_in_trial_period',
    },
    originalPurchaseDateMs: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'original_purchase_date_ms',
    },
    originalTransactionId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'original_transaction_id',
    },
    productId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'product_id',
    },
    purchaseDateMs: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'purchase_date_ms',
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subscriptionGroupIdentifier: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'subscription_group_identifier'
    },
    transactionId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'transaction_id',
    },
    webOrderLineItemId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      field: 'web_order_line_item_id',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  },
    {
      tableName: 'apple_subscriptions',
      timestamps: false,
      underscored: true,
    },
  )

  AppleSubscription.associate = models => {
    AppleSubscription.belongsTo(models.User, { as: 'user', foreignKey: 'userId', targetKey: 'id' })
  }

  return AppleSubscription
}
