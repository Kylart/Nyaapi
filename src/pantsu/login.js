const axios = require('axios')

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

    axios({
      method: 'post',
      url: URI + 'login',
      data: {
        username: opts.username,
        password: opts.password
      }
    })
      .then(({data}) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  login
}
