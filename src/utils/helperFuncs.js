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

  isValidEmail: email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(String(email).toLowerCase())
  },

  writeFile: (path, buffer) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, buffer, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  },

  createSlug: title => {
    let link = title.trim().toLowerCase()

    link = link.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    link = link.replace(/-/g, '')
    link = link.replace(/\//g, ' ')
    link = link.replace(/\\/g, '')
    link = link.replace(/[!;\\\\/:*?"<>|&'()$%,.’]/g, '')
    link = link.trim()
    link = link.replace(/\s+/g, '-')

    return link
  },

  wait: secs => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, secs * 1000)
    })
  },
}
