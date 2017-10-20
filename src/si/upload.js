const request = require('request-promise')
const {createReadStream} = require('fs')

const URI = require('./url.json').url

/**
 * Allows to upload file or magnet to nyaa.si
 *
 * @param {object} opts
 *
 * @returns {promise}
 */

const upload = (opts) => {
  return new Promise((resolve, reject) => {
    if (!opts.credentials) {
      reject(new Error('[Nyaapi]: No credentials given on upload demand.'))
    }

    if (!opts.torrent) {
      reject(new Error('[Nyaapi]: No torrent file given on upload demand.'))
    }

    if (!opts.torrent.slice(-8) !== '.torrent') {
      reject(new Error('[Nyaapi]: The uploaded file must be a .torrent file.'))
    }

    if (!opts.name) {
      reject(new Error('[Nyaapi]: No name given on upload demand.'))
    }

    if (!opts.category) {
      reject(new Error('[Nyaapi]: No category given on upload demand.'))
    }

    request.post({
      url: URI + 'api/upload',
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
