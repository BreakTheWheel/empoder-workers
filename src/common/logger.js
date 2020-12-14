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

const logger = bunyan.createLogger({
  name: 'empoder-worker',
  streams: logStreams,
})

module.exports = logger
