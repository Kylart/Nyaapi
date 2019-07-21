const req = require('request-promise')
const omit = require('lodash.omit')

const URI = require('./url.json').url

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
      url: `${URI}update`,
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
