require('dotenv').config({ silent: false })
const parse = require('pg-connection-string').parse

const config = parse(process.env.DATABASE_URL)
const dbObj = {
  username: config.user,
  password: config.password,
  database: config.database,
  host: config.host,
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
}

module.exports = {
  development: dbObj,
  production: dbObj,
}
