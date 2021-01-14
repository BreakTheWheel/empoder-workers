const fs = require('fs')
const uuid = require('uuid')

module.exports = {
  mapLogingObject: ({ requestId, href, request, method } = {}, err = {}) => {
    const error = err.response && err.response.data & Object.keys(err.response.data).length > 0 ? err.response.data : err

    if (!requestId) {
      requestId = uuid.v4()
    }

    return {
      err: error,
      requestId,
      url: href,
      body: request.body,
      method,
    }
  },

  wait: secs => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, secs * 1000)
    })
  },
}
