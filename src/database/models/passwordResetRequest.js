
module.exports = (sequelize, DataTypes) => {
  const PasswordResetRequest = sequelize.define('PasswordResetRequest', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_used',
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at',
    },
  },
    {
      tableName: 'password_reset_requests',
      timestamps: true,
      underscored: true,
    },
  )

  return PasswordResetRequest
}
