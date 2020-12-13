/* eslint-disable no-process-env, import/first, global-require */

require('dotenv').config({ silent: false })

const env = process.env.NODE_ENV

const defaultConfig = require('./default')(env)

module.exports = defaultConfig
