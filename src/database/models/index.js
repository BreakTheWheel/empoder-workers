const administrator = require('./administrator')
const phoneNumber = require('./phoneNumber')
const user = require('./user')
const passwordResetRequest = require('./passwordResetRequest')
const appleSubscription = require('./appleSubscription')
const trade = require('./trade')
const priceTarget = require('./priceTarget')
const stockSymbol = require('./stockSymbol')
const newsArticle = require('./newsArticle')
const peer = require('./peer')
const companyProfile = require('./companyProfile')
const funds = require('./fund')
const fundOwnership = require('./fundOwnership')
const recommendationTrend = require('./recommendationTrend')
const quote = require('./quote')
const newsSentiment = require('./newsSentiment')
const upgradeDowngrade = require('./upgradeDowngrade')
const earningsCalendar = require('./earningsCalendar')
const stockOption = require('./stockOption')
const earningsEstimate = require('./earningsEstimate')
const signal = require('./signal')
const etfsHolding = require('./etfsHolding')
const etfsHoldingValue = require('./etfsHoldingValue')
const companyBasicFinancial = require('./companyBasicFinancial')
const signalRecommendationTrend = require('./signalRecommendationTrend')
const incomeStatement = require('./incomeStatement')
const cashFlowStatement = require('./cashFlowStatement')
const balanceSheet = require('./balanceSheet')

const models = {
  administrator,
  phoneNumber,
  user,
  passwordResetRequest,
  appleSubscription,
  trade,
  priceTarget,
  stockSymbol,
  newsArticle,
  peer,
  companyProfile,
  funds,
  fundOwnership,
  recommendationTrend,
  quote,
  newsSentiment,
  upgradeDowngrade,
  earningsCalendar,
  stockOption,
  earningsEstimate,
  signal,
  etfsHolding,
  etfsHoldingValue,
  companyBasicFinancial,
  signalRecommendationTrend,
  incomeStatement,
  cashFlowStatement,
  balanceSheet,
}

module.exports = models
