const crypto = require('crypto')
const Promise = require('bluebird')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const BEARER_PREFIX = 'Bearer '

module.exports = {
  generateAccessToken (payload) {
    return jwt.sign(payload, config.auth.secret, config.auth.createOptions)
  },

  async generateRefreshToken (user, db) {
    const token = jwt.sign(user, config.auth.secret, config.auth.refreshCreateOptions)
    const storedRefreshToken = await db.RefreshToken.create({
      token,
      userId: user.id,
      email: user.email,
    })

    return storedRefreshToken
  },

  verifyRefreshToken (token) {
    return jwt.verify(token, config.auth.secret, config.auth.verifyOptions)
  },

  verifyAccessToken (authToken) {
    const token = authToken.replace(BEARER_PREFIX, '')
    return jwt.verify(token, config.auth.secret, config.auth.verifyOptions)
  },

  hashPassword (password) {
    return bcrypt.hash(pepperify(password), config.auth.saltRounds)
  },

  comparePasswords (plaintext, ciphertext) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pepperify(plaintext), ciphertext, (err, match) => {
        if (err) {
          return reject(new Error('passwords do not match'))
        }

        resolve(match)
      })
    })
  },

  async generateResetPasswordToken () {
    const bytes = await Promise.fromCallback(done =>
      crypto.randomBytes(config.auth.resetPasswordTokenLength, done))

    return bytes.toString('hex')
  },
}

/**
 * Apply system-configured pepper to any given string
 *
 * @param {String} string The string to pepperify
 * @return {String} SHA-1 hash of the input string with pepper applied
 */
function pepperify (string) {
  return crypto
    .createHmac('sha1', config.auth.secret)
    .update(string)
    .digest('hex')
}
