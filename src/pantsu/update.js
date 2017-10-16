const axios = require('axios')

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
    }

    axios({
      method: 'post',
      url: URI + 'update',
      headers: {
        'Authorization': opts.token
      },
      data: {
        username: opts.username || null,
        id: opts.id,
        name: opts.name || null,
        category: opts.category || null,
        remake: opts.remake || null,
        description: opts.description || null,
        status: opts.status || null,
        hidden: opts.hidden || null,
        website_link: opts.website_link || null,
        languages: opts.languages || null
      }
    })
      .then(({data}) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  update
}
