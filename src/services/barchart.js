const axios = require('axios')

const apiKey = '3a411d0d85c742ef25a25de54e941a34'

module.exports = {
  equityOptions: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      http://ondemand.websol.barchart.com/getEquityOptions.json?apikey=${apiKey}&underlying_symbols=${symbol}&fields=volatility,delta,gamma,theta,vega,rho,bid,bidSize,bidDate,ask,askSize,askDate,premium,settlement,lastTradeDate,openInterest,volume
    `)

    return data
  },
}
