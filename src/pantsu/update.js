const req = require('request-promise')
const omit = require('lodash.omit')

const { config } = require('./config.js')

/**
 * Allows the updating of a torrent.
 *
 * @param {Object} opts All the paramters to update (id goes here)
 *
 * @returns {promise}
 */

const update = (opts = {}) => {
  return new Promise((resolve, reject) => {
    if (!opts.id || !opts.token) {
      reject(new Error('[Nyaapi]: No ID or Token given on update demand.'))
      return
    }

    req.put({
      url: `${config.url}update`,
      headers: {
        Authorization: opts.token
      },
      formData: omit(opts, 'token')
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  update
}
