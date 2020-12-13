const cluster = require('cluster')
const bunyan = require('bunyan')
const config = require('../config')

const logStreams = []

// Stdout stream
if (config.logging.stdout.enabled) {
  logStreams.push({
    level: config.logging.stdout.level,
    stream: process.stdout,
  })
}

const suffix = cluster.isMaster ? 'master' : 'worker'
const logger = bunyan.createLogger({
  name: `${config.appName}.${suffix}`,
  streams: logStreams,
})

module.exports = logger
