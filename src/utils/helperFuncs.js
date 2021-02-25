const uuid = require('uuid')
const logger = require('../common/logger')

function wait(secs) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, secs * 1000)
  })
}

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

  roundToTwo: num => {
    return +(Math.round(num + 'e+2') + 'e-2')
  },

  wait,

  requestHelper: async (processName, func) => {
    let items
    let tries = 1

    while (!items) {
      try {
        items = await func()
      } catch (err) {
        if (tries === 5) {
          logger.error({ processName }, 'Too many tries')

          break
        }

        tries++
        logger.error({ processName, err: err.response || err })

        if (err.response && err.response.status === 401) {
          break
        }

        const message = err.response && err.response.data

        if (message === 'Unknown symbol' || message === 'Not found') {
          break
        }

        await wait(2)
      }
    }

    return items
  },
}
