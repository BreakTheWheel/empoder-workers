const trades = require('./trades')
const companyProfile = require('./companyProfile')
const fundOwnership = require('./fundOwnership')
const peers = require('./peers')
const priceTargets = require('./priceTargets')
const recommendationTrends = require('./recommendationTrends')
const stockSymbols = require('./stockSymbols')
const newsSentiment = require('./newsSentiment')
const upgradeDowngrade = require('./upgradeDowngrade')
const optionsActivity = require('./optionsActivity')
const earningsEstimates = require('./earningsEstimates')
const earningsCalendar = require('./earningsCalendar')
const etfsHoldings = require('./etfsHoldings')
const signals = require('./signals')
const realTimeQuote = require('./realTimeQuote')
const financialStatements = require('./financialStatements')
const historicalPrices = require('./historicalPrices')
const ipoCalendar = require('./ipoCalendar')
// const companyBasicFinancials = require('./companyBasicFinancials')

// Pusher
trades.start()
realTimeQuote.start()

// non stop
signals.start()

// 17:00 new york time
companyProfile.updateCompanyProfile.start()

// 18:00
// companyBasicFinancials.updateCompanyProfile.start() 

// 19:00
fundOwnership.fundOwnership.start()

// 22:00
peers.updatePeers.start()

// 23:00
etfsHoldings.updateEtfsHoldings.start()

// 01:00
priceTargets.priceTarget.start()

// 02:00
earningsCalendar.updateEarningsCalendar.start()

// 03:00
recommendationTrends.updateRecommendationTrends.start()

// 05:00
stockSymbols.stockSymbols.start()
historicalPrices.updateHistoricalPrices.start()

// 07:00
upgradeDowngrade.updateUpgradeDowngrade.start()

// 9pm
ipoCalendar.updateEarningsCalendar.start()

// 10:00
optionsActivity.updateStockOptions.start()

// 11:00
financialStatements.updateFinancialStatements.start()

// every 2 hours
newsSentiment.updateNewsSentiment.start()
earningsEstimates.updateEarningsEstimates.start()
