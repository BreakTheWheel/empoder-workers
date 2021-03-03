const axios = require('axios')

const msEmail = 'dc@breakthewheel.com'
const msPassword = 'Cristal4464!'

module.exports = {
  login: async () => {
    const { data } = await axios.default.get(`
      https://equityapi.morningstar.com/WSLogin/Login.asmx/Login?email=${msEmail}&password=${msPassword}&responseType=json
    `)

    return data ? data.Token : null
  },

  balanceSheets: async ({ token, exchangeId, symbol, startDate, endDate }) => {
    const { data } = await axios.default.get(`
      https://equityapi.morningstar.com/Webservice/CompanyFinancialsService.asmx/GetBalanceSheet?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&statementType=Annual&dataType=AOR&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}
    `)

    return data
  },

  incomeStatements: async ({ token, exchangeId, symbol, startDate, endDate, type }) => {
    const { data } = await axios.default.get(`
      https://equityapi.morningstar.com/Webservice/CompanyFinancialsService.asmx/GetIncomeStatement?exchangeId=${exchangeId}&identifierType=Symbol&identifier=${symbol}&statementType=${type}&dataType=AOR&startDate=${startDate}&endDate=${endDate}&responseType=json&Token=${token}
    `)

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

  stocks: async ({ exchangeId }) => {
    const url = `https://equityapi.morningstar.com/DataCatalogOutput.aspx?category=GetStockExchangeSecurityList&exchangeId=${exchangeId}&identifier=${exchangeId}&identifierType=ExchangeId&stockStatus=All&responseType=Json`
    const result = await axios.default.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
        Cookie: '_ga=GA1.2.1634639483.1613673596; _parsely_visitor={%22id%22:%22pid=88c4ddf5a48fc80d9a6fe0890fca5d31%22%2C%22session_count%22:1%2C%22last_session_ts%22:1613673596363}; _fbp=fb.1.1613673622111.1276193314; _hp2_id.undefined=%7B%22userId%22%3A%225504917710264576%22%2C%22pageviewId%22%3A%224041611686679236%22%2C%22sessionId%22%3A%225174975232382734%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; _gcl_au=1.1.1161697116.1613673774; mid=36073578815717137; _uetvid=c1d80fb0721811ebb4f09f67c738d4b1; _hp2_id.3604294647=%7B%22userId%22%3A%223854607767008617%22%2C%22pageviewId%22%3A%225107847877141413%22%2C%22sessionId%22%3A%221043249864275508%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; ELOQUA=GUID=C0A161685A834ED6BD6DB5B1C7D1FA3E&FPCVISITED=1; CookieEnable=1; ASP.NET_SessionId=pr3kzt25j5y0t0edvma1sxsn; EquityAPIUI=API=OZa5P_yA7aN6N4TfLUZroBVKd_QM-d4kD6ksdGsfs4qtCycwTl672EzliOYSur__V0abNhdsxws1',
      },
    })

    return result.data
  },
}
