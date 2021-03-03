//const trades = require('./trades')
const companyProfile = require('./companyProfile')
const fundOwnership = require('./fundOwnership')
// const peers = require('./peers')
const priceTargets = require('./priceTargets')
const recommendationTrends = require('./recommendationTrends')
const stockSymbols = require('./stockSymbols')
const newsSentiment = require('./newsSentiment')
// const upgradeDowngrade = require('./upgradeDowngrade')
const optionsActivity = require('./optionsActivity')
const earningsEstimates = require('./earningsEstimates')
const earningsCalendar = require('./earningsCalendar')
const etfsHoldings = require('./etfsHoldings')
const signals = require('./signals')
const realTimeQuote = require('./realTimeQuote')
// const iexRealTimeNews = require('./iexRealTimeNews')
const fhRealTimeNews = require('./fhRealTimeNews')
const delayedQuote = require('./delayedQuote')
const financialStatements = require('./financialStatements')
const historicalPrices = require('./historicalPrices')
// const ipoCalendar = require('./ipoCalendar')
// const companyBasicFinancials = require('./companyBasicFinancials')
const exchangeRates = require('./currencyExchange')
const barchartOptions = require('./barchartOptions')
const iexBalanceSheet = require('./iexBalanceSheets')
const iexIncomeStatements = require('./iexIncomeStatements')
const cleanup = require('./cleanup')
const stockNews = require('./stockNews')
const msStockSymbols = require('./msStockSymbols')
const msBalanceSheets = require('./msBalanceSheets')
const msIncomeStatements = require('./msIncomeStatements')

// // Pusher
// trades.start()
realTimeQuote.start() //IEX
delayedQuote.start()
fhRealTimeNews.start() // FH
// iexRealTimeNews.start() // IEX

// non stop
signals.start()

// 18:00
companyProfile.updateCompanyProfile.start() // FH  

// 18:00
// companyBasicFinancials.updateCompanyProfile.start() 

// 20:00
fundOwnership.fundOwnership.start() // FH 

// 22:00
// peers.updatePeers.start()

// 23:00
etfsHoldings.updateEtfsHoldings.start() // FH 

// 02:00
priceTargets.priceTarget.start() // FH 

// 05:00
earningsCalendar.updateEarningsCalendar.start() // FH 

// 08:00
recommendationTrends.updateRecommendationTrends.start() // FH 

// 11:00
stockSymbols.stockSymbols.start() // FH 

// 06:00
historicalPrices.updateHistoricalPrices.start() // IEX 

// 07:00
// upgradeDowngrade.updateUpgradeDowngrade.start()

// 14:00
earningsEstimates.updateEarningsEstimates.start()  // FH 

// 9pm
// not used for now
// ipoCalendar.updateEarningsCalendar.start()

// 11:00
optionsActivity.updateStockOptions.start() // IEX

// 16:30
financialStatements.updateFinancialStatements.start()  // FH 

// every 5 hours
newsSentiment.updateNewsSentiment.start()  // FH 

// every 1 hour
exchangeRates.updateCurrencyExchanges.start() // FH 

// every 15min
barchartOptions.updateStockOptions.start() // BC

iexBalanceSheet.updateIexBalanceSheets.start() // IEX

iexIncomeStatements.updateIexIncomeStatements.start() // IEX

cleanup.cleanup.start()

stockNews.updateStockNews.start()

// morning star
msStockSymbols.stockSymbols.start()
msIncomeStatements.updateIncomeStatements.start()
msBalanceSheets.updateMsBalanceSheets.start()