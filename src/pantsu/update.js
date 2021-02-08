const omit = require('lodash.omit')

/**
 * Allows the updating of a torrent.
 *
 * @param {Object} opts All the paramters to update (id goes here)
 *
 * @returns {promise}
 */
async function update (opts = {}) {
  if (!opts.id || !opts.token) {
    throw new Error('[Nyaapi]: No ID or Token given on update demand.')
  }

  const { data } = await this.cli.put(
    '/update',
    omit(opts, 'token'), {
      headers: {
        Authorization: opts.token
      }
    })

  return data
}

module.exports = {
  update
}
