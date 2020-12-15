const request = require('request-promise')
const { createReadStream } = require('fs')

const { config } = require('./config.js')

/**
 * Allows to upload file or magnet to nyaa.si
 *
 * @param {object} opts Object description all the information to upload
 *
 * @returns {promise}
 */

const upload = (opts) => {
  return new Promise((resolve, reject) => {
    if (!opts.credentials) {
      reject(new Error('[Nyaapi]: No credentials given on upload demand.'))
      return
    }

    if (!opts.torrent) {
      reject(new Error('[Nyaapi]: No torrent file given on upload demand.'))
      return
    }

    if (!opts.category) {
      reject(new Error('[Nyaapi]: No category given on upload demand.'))
      return
    }

    request.post({
      url: config.url + 'api/upload',
      auth: opts.credentials,
      formData: {
        torrent: createReadStream(opts.torrent),
        torrent_data: JSON.stringify({
          name: opts.name,
          category: opts.category,
          information: opts.information,
          description: opts.description,
          anonymous: opts.anonymous,
          hidden: opts.hidden,
          complete: opts.complete,
          remake: opts.remake,
          trusted: opts.trusted
        })
      }
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  upload
}
