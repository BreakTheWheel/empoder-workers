const _ = require('lodash')
const crypto = require('../../utils/crypto')

module.exports = (sequelize, DataTypes) => {
  const Administrator = sequelize.define('Administrator', {
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
      allowNull: false,
      field: 'last_name',
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
  }, {
    tableName: 'administrators',
    timestamps: false,
    underscored: true,
    hooks: {
      async beforeUpdate(admin) {
        if (admin.password) {
          admin.password = await crypto.hashPassword(admin.password)
        }
      },
      async beforeCreate(admin) {
        admin.password = await crypto.hashPassword(admin.password)
      },
    },
  })

  // ------ Instance methods --------------------------------------------------

  // Prevent returning password field in the response
  Administrator.prototype.toJSON = function toJSON() {
    const user = this.get()
    return _.omit(user, ['password'])
  }

  return Administrator
}
