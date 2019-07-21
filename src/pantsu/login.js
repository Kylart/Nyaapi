const request = require('request-promise')

const URI = require('./url.json').url

/**
 * Allows to log into nyaa.pantsu.cat
 *
 * @param {Object} opts Object containing a username aong with its password.
 *
 * @returns {promise}
 */

const login = (opts = {}) => {
  return new Promise((resolve, reject) => {
    if (!opts.username || !opts.password) {
      reject(new Error('[Nyaapi]: No username or password were given on login demand.'))
      return
    }

    request.post(URI + 'login', {
      json: {
        username: opts.username,
        password: opts.password
      }
    })
      .then((data) => resolve(JSON.parse(data)))
      .catch((err) => reject(err))
  })
}

module.exports = {
  login
}
