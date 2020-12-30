const administrator = require('./administrator')
const phoneNumber = require('./phoneNumber')
const user = require('./user')
const passwordResetRequest = require('./passwordResetRequest')
const appleSubscription = require('./appleSubscription')
const trade = require('./trade')
const priceTarget = require('./priceTarget')
const stockSymbol = require('./stockSymbol')

const models = {
  administrator,
  phoneNumber,
  user,
  passwordResetRequest,
  appleSubscription,
  trade,
  priceTarget,
  stockSymbol,
}

module.exports = models
