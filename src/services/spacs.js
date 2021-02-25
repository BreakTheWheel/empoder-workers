const axios = require('axios')

const apiKey = 'f4965236-8c4c-441d-a1fa-14caf97b1094'

module.exports = {
  allCompanies: async () => {
    const { data } = await axios.default.get('https://api-v1-get-all-companies.spactrax.workers.dev', {
      headers: {
        'X-Spactrax': apiKey,
      },
    })

    return data ? JSON.parse(data) : null
  },

  allTeams: async () => {
    const { data } = await axios.default.get('https://api-v1-get-all-teams.spactrax.workers.dev', {
      headers: {
        'X-Spactrax': apiKey,
      },
    })

    return data ? JSON.parse(data) : null
  },

  latestFilings: async () => {
    const { data } = await axios.default.get('https://api-v1-get-all-filings.spactrax.workers.dev', {
      headers: {
        'X-Spactrax': apiKey,
      },
    })

    return data ? JSON.parse(data) : null
  },
}
