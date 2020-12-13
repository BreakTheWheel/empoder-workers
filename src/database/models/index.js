const administrator = require('./administrator')
const phoneNumber = require('./phoneNumber')
const user = require('./user')
const passwordResetRequest = require('./passwordResetRequest')
const appleSubscription = require('./appleSubscription')
const trade = require('./trade')

const models = {
  administrator,
  phoneNumber,
  user,
  passwordResetRequest,
  appleSubscription,
  trade,
}

module.exports = models
