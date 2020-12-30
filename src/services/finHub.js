const finnhub = require('finnhub')
const axios = require('axios')

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
      finnhubClient.fundOwnership(symbol, { limit: 20 }, (error, data) => {
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
      finnhubClient.companyBasicFinancials(symbol, 'margin', (error, data) => {
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

  stockSymbols: ({ exchange }) => {
    return new Promise((resolve, reject) => {
      finnhubClient.stockSymbols(exchange, (error, data) => {
        if (error) {
          return reject(error)
        }

        resolve(data)
      })
    })
  },

  pressReleases: async ({ symbol }) => {
    const { data } = await axios.default.get(`
      https://finnhub.io/api/v1/press-releases?symbol=${symbol}&token=${key}
    `)

    return data
  },
}