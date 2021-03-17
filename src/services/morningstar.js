const axios = require('axios')

const msEmail = process.env.MS_EMAIL
const msPassword = process.env.MS_PASSWORD
const msMarketUsername = process.env.MS_MARKET_USERNAME
const msMarketPassword = process.env.MS_MARKET_PASSWORD

module.exports = {
  login: async () => {
    const { data } = await axios.default.get(`
      https://equityapi.morningstar.com/WSLogin/Login.asmx/Login?email=${msEmail}&password=${msPassword}&responseType=json
    `)

    return data ? data.Token : null
  },

  balanceSheets: async ({ token, exchangeId, symbol, type, startDate, endDate }) => {
    const { data } = await axios.default.get(`
      https://equityapi.morningstar.com/Webservice/CompanyFinancialsService.asmx/GetBalanceSheet?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&statementType=${type}&dataType=AOR&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}
    `)

    return data
  },

  incomeStatements: async ({ token, exchangeId, symbol, startDate, endDate, type }) => {
    const url = `https://equityapi.morningstar.com/Webservice/CompanyFinancialsService.asmx/GetIncomeStatement?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&statementType=${type}&dataType=AOR&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}`
    const { data } = await axios.default.get(url)

    return data
  },

  incomeStatementsTTM: async ({ token, exchangeId, symbol, startDate, endDate }) => {
    const url = `https://equityapi.morningstar.com/Webservice/CompanyFinancialsService.asmx/GetIncomeStatementTTM?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}`
    const { data } = await axios.default.get(url)

    return data
  },

  regions: async ({ token }) => {
    const { data } = await axios.default.get(`
    https://equityapi.morningstar.com/WebService/GlobalMasterListsService.asmx/GetExchangeRegionList?responseType=json&Token=${token}
    `)

    return data
  },

  exchanges: async ({ regionId, token }) => {
    const { data } = await axios.default.get(`
     https://equityapi.morningstar.com/WebService/GlobalMasterListsService.asmx/GetExchangeList?identifierType=RegionId&identifier=${regionId}&responseType=json&Token=${token}
    `)

    return data
  },

  stocks: async ({ exchangeId, token }) => {
    const url = `https://equityapi.morningstar.com/WebService/GlobalMasterListsService.asmx/GetStockExchangeSecurityList?category=GetStockExchangeSecurityList&exchangeId=${exchangeId}&identifier=${exchangeId}&identifierType=ExchangeId&stockStatus=All&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  valuationRatios: async ({ exchangeId, symbol, token }) => {
    const url = `https://equityapi.morningstar.com/Webservice/FinancialKeyRatiosService.asmx/GetValuationRatios?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&period=Snapshot&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  marketCap: async ({ exchangeId, symbol, token }) => {
    const url = `https://equityapi.morningstar.com/Webservice/MarketPerformanceService.asmx/GetCurrentMarketCapitalization?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  fundHoldingsDetail: async ({ exchangeId, symbol, token }) => {
    const url = `https://equityapi.morningstar.com/Webservice/OwnershipService.asmx/GetFundHoldingsDetail?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&minimumFundRating=0&minPercentChange=-50&maxPercentChange=50&zeroPercentChangeRejected=false&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  fundHoldingsSummary: async ({ exchangeId, symbol, token }) => {
    const url = `https://equityapi.morningstar.com/Webservice/OwnershipService.asmx/GetFundHoldingsSummary?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  institutionalHoldingsSummary: async ({ exchangeId, symbol, token }) => {
    const url = `https://equityapi.morningstar.com/Webservice/OwnershipService.asmx/GetInstitutionalHoldingsSummary?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },

  getQuote: async ({ instrumentId }) => {
    const url = `http://mstxml.tenfore.com/Index.php?username=${msMarketUsername}&password=${msMarketPassword}&Instrument=${instrumentId}T&JSONShort`
    const result = await axios.default.get(url)

    return result.data
  },

  symbolsGuide: async ({ exchangeId }) => {
    const url = `http://mstxml.tenfore.com/symbolGuide?username=${msMarketUsername}&password=${msMarketPassword}&exchange=${exchangeId}&security=1&JSONShort`
    const result = await axios.default.get(url)

    return result.data
  },

  growthRatios: async ({ exchangeId, symbol, startDate, endDate, token, type }) => {
    const url = `https://equityapi.morningstar.com/Webservice/FinancialKeyRatiosService.asmx/GetGrowthRatios?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&statementType=${type}&dataType=AOR&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}`
    const result = await axios.default.get(url)

    return result.data
  },
}
