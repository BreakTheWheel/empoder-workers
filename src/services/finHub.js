const finnhub = require('finnhub')
const axios = require('axios')
const { types } = require('pg')

// https://www.npmjs.com/package/finnhub

const apiKey = finnhub.ApiClient.instance.authentications['api_key']

const key = 'bv0r50n48v6u4eacbi10'
apiKey.apiKey = key

const finnhubClient = new finnhub.DefaultApi()

module.exports = {
  stockCandles: ({ symbol, resolution, from, to }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.stockCandles(symbol, resolution, from, to, {}, (error, data) => {
        if (error) {
          return reject(error)
        }
        if (!data.o) {
          return resolve()
        }
        resolve({
          openPrice: data.o,
          highPrice: data.h,
          lowPrice: data.l,
          currentPrice: data.c,
          volume: data.v,
          timestamp: data.t,
        })
      })
    })
  },

  quote: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.quote(symbol, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve({
          openPrice: data.o,
          highPrice: data.h,
          lowPrice: data.l,
          currentPrice: data.c,
          previousClosePrice: data.pc,
        })
      })
    })
  },

  priceTarget: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.priceTarget(symbol, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  fundOwnership: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.fundOwnership(symbol, {}, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  recommendationTrends: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.recommendationTrends(symbol, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  upgradeDowngrade: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.upgradeDowngrade({ symbol }, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  basicFinancials: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.companyBasicFinancials(symbol, 'all', (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  newsSentiment: ({ symbol }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.newsSentiment(symbol, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  companyNews: ({ symbol, from, to }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.companyNews(symbol, from, to, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  news: ({ category }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.generalNews(category, {}, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  etfsHoldings: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/etf/holdings?symbol=${symbol}&token=${key}
    `)

    return data
  },

  stockSymbols: async ({ exchange }) => {
    const result = await axios.default.get(`
      https://finnhub.io/api/v1/stock/symbol?exchange=${exchange}&token=${key}
    `)

    return result.data
  },

  pressReleases: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/press-releases?symbol=${symbol}&token=${key}
    `)

    return data
  },

  stockPeers: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${key}
    `)

    return data
  },

  companyProfile: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/stock/profile?symbol=${symbol}&token=${key}
    `)

    return data
  },

  lastBidAsk: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/stock/bidask?symbol=${symbol}&token=${key}
    `)

    return data
  },

  earningsCalendar: async ({ from, to, symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/calendar/earnings?symbol=${symbol}&from=${from}&to=${to}&token=${key}
    `)

    return data
  },

  earningsEstimate: async ({ symbol, freq = 'quarterly' }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/stock/eps-estimate?symbol=${symbol}&freq=${freq}&token=${key}
    `)

    return data
  },

  financialStatements: async ({ symbol, freq = 'quarterly', type }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/stock/financials?symbol=${symbol}&statement=${type}&freq=${freq}&token=${key}
    `)

    return data
  },
}
