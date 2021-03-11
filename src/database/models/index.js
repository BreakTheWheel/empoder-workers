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
const dailyVolume = require('./dailyVolume')
const historicalPrice = require('./historicalPrice')
const signalPriceTarget = require('./signalPriceTarget')
const etfsAggregate = require('./etfsAggregate')
const sector = require('./sector')
const signalEtfsAggregate = require('./signalEtfsAggregate')
const signalIncomeStatement = require('./signalIncomeStatement')
const delayedQuote = require('./delayedQuote')
const currencyExchangeRate = require('./currencyExchangeRate')
const barchartOption = require('./barchartOption')
const iexIncomeStatement = require('./iexIncomeStatement')
const iexBalanceSheet = require('./iexBalanceSheet')
const stockNewsArticle = require('./stockNewsArticle')
const msExchange = require('./msExchange')
const msRegion = require('./msRegion')
const msStockSymbol = require('./msStockSymbol')
const msBalanceSheet = require('./msBalanceSheet')
const msIncomeStatement = require('./msIncomeStatement')
const msValuationRatio = require('./msValuationRatio')
const msMarketCap = require('./msMarketCap')

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
  dailyVolume,
  historicalPrice,
  signalPriceTarget,
  etfsAggregate,
  sector,
  signalEtfsAggregate,
  signalIncomeStatement,
  delayedQuote,
  currencyExchangeRate,
  barchartOption,
  iexIncomeStatement,
  iexBalanceSheet,
  stockNewsArticle,
  msRegion,
  msExchange,
  msStockSymbol,
  msBalanceSheet,
  msIncomeStatement,
  msValuationRatio,
  msMarketCap,
}

module.exports = models
