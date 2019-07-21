/**
 * Resources explaining the choices
 *
 * https://github.com/gin-gonic/gin/issues/931
 * https://github.com/axios/axios/issues/623
 */

const fs = require('fs')
const req = require('request-promise')
const omit = require('lodash.omit')

const URI = require('./url.json').url

/**
 * Allows the uploading of torrent file to nyaa.pantsu.cat
 *
 * @param {Object} opts Options.
 *
 * @returns {promise}
 */

const upload = (opts = {}) => {
  return new Promise((resolve, reject) => {
    if ((!opts.magnet && !opts.torrent) || !opts.token || !opts.username) {
      reject(new Error('[Nyaapi]: No file/torrent, token or username were given.'))
      return
    }

    if (opts.torrent) {
      opts.torrent = fs.createReadStream(opts.torrent)
    }

    req.post({
      url: `${URI}upload`,
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
  upload
}
