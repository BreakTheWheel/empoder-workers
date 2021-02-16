const alphaKey = '20OZ1DN3IZGAWLLU'
const axios = require('axios')

module.exports = {
  exchangeRate({ fromCurrency, toCurrency }) {
    return axios.default.get('https://www.alphavantage.co/query', {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: alphaKey,
      },
    })
  },
}
