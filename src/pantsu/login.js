const request = require('request-promise')

const URI = require('./url.json').url

/**
 * Allows to log into nyaa.pantsu.cat
 *
 * @param {Object} credentials Object containing a username aong with its password.
 * @param {String} credentials.username Your username
 * @param {String} credentials.password Your password
 *
 * @returns {promise}
 */

const login = (credentials = {}) => {
  return new Promise((resolve, reject) => {
    if (!credentials.username || !credentials.password) {
      reject(new Error('[Nyaapi]: No username or password were given on login demand.'))
      return
    }

    request.post(URI + 'login', {
      json: credentials
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  login
}
