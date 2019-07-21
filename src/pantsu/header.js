const request = require('request-promise')

const URI = require('./url.json').url

/**
 * Allows to request torrent's head its ID.
 *
 * @param {number|string} id The ID of the torrent.
 *
 * @returns {promise}
 */

const checkHeader = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('[Nyaapi]: No ID was given on torrent head request.'))
      return
    }

    request.head(`${URI}view/${id}`)
      .then((data) => resolve(JSON.parse(data)))
      .catch((err) => reject(err))
  })
}

module.exports = {
  checkHeader
}
