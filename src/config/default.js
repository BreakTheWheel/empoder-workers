/* eslint-disable no-process-env */

const os = require('os')
const pkg = require('../../package')

module.exports = env => ({
  env,
  appName: 'empoder-api',
  version: pkg.version,
  server: {
    concurrency: os.cpus().length,
    port: process.env.PORT || 3001,
    maxMemory: process.env.WEB_MEMORY || 512,
    killTimeout: 3000,
    bodyParser: {
      multipart: true,
    },
    cors: {
      origin: '*',
      exposeHeaders: [
        'Authorization',
        'Content-Language',
        'Content-Length',
        'Content-Type',
        'Date',
        'ETag',
      ],
      maxAge: 3600,
    },
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    saltRounds: 10,
    resetPasswordTokenLength: 20,
    createOptions: {
      // expires in 1 year
      expiresIn: 365 * 24 * 60 * 60,
      algorithm: 'HS256',
      issuer: `the-approved-api-${env}`,
    },
    refreshCreateOptions: {
      // expires in 2 days
      expiresIn: 48 * 60 * 60,
      algorithm: 'HS256',
      issuer: `the-approved-api-${env}`,
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: `the-approved-api-${env}`,
    },
  },
  database: {
    options: {
      operatorsAliases: false,
      pool: {
        max: 100000,
        min: 0,
        idle: 2000000,
        acquire: 10000000,
      },
      dialectOptions: {
        ssl: process.env.NODE_ENV !== 'local' // false when its local database, otherwise true
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL
      || 'postgres://postgres@localhost:5432/koa-database',
  },
  logging: {
    stdout: {
      enabled: true,
      level: 'debug',
    },
  },
})
