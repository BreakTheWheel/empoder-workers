const axios = require('axios')

const baseUrl = process.env.IEX_CLOUD_BASE_URL
const token = process.env.IEX_CLOUD_TOKEN

module.exports = {
  stockOptionDates: async ({ symbol }) => {
    const result = await axios.default.get(`
      ${baseUrl}/stable/stock/${symbol.toLowerCase()}/options?token=${token}
    `)

    return result.data
  },

  stockOptions: async ({ symbol, expiration }) => {
    const result = await axios.default.get(`
      ${baseUrl}/stable/stock/${symbol.toLowerCase()}/options/${expiration}?token=${token}
    `)

    return result.data
  },

  quote: async ({ symbol }) => {
    const result = await axios.default.get(`
      ${baseUrl}/stable/stock/${symbol.toLowerCase()}/quote?token=${token}
    `)

    return result.data
  },

  delayedQuote: async ({ symbol }) => {
    const result = await axios.default.get(`
      ${baseUrl}/stable/stock/${symbol.toLowerCase()}/delayed-quote?token=${token}
    `)

    return result.data
  },

  historicalPrices: async ({ symbol, date }) => {
    const result = await axios.default.get(`
      ${baseUrl}/stable/stock/${symbol.toLowerCase()}/chart/date/${date}?chartByDay=true&token=${token}
    `)

    return result.data
  },
}
