const axios = require('axios')

const apiKey = 'qleac30j2oarnwyk6ins3goqdf2dhnswmsxcbobc'

module.exports = {
  companyTickerNews: async ({ symbols }) => {
    const { data } = await axios.default.get(`
      https://stocknewsapi.com/api/v1?tickers=${symbols.join(',')}&items=50&token=${apiKey}
    `)

    return data
  },

  allTickerNews: async () => {
    const { data } = await axios.default.get(`
      https://stocknewsapi.com/api/v1/category?section=alltickers&items=50&token=${apiKey}
    `)

    return data
  },
}
