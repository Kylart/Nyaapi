const axios = require('axios')

const URI = require('./url.json').url

/**
 * Request torrent information according to its ID.
 *
 * @param {number} id The ID of the torrent you want information of.
 *
 * @returns {promise}
 */

const infoRequest = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('[Nyaapi]: No ID given on request demand.'))
    } else {
      axios.get(`${URI}view/${id}`)
        .then(({data}) => resolve(data))
        .catch((err) => reject(err))
    }
  })
}

module.exports = {
  infoRequest
}
