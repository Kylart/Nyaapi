const request = require('request-promise')

const { config } = require('./config.js')

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

    request.get(`${config.url}view/${id}`)
      .on('response', (response) => resolve(response.statusMessage))
      .catch((err) => reject(err))
  })
}

module.exports = {
  checkHeader
}
