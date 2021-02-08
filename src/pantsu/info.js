/**
 * Request torrent information according to its ID.
 *
 * @param {number} id The ID of the torrent you want information of.
 *
 * @returns {promise}
 */

async function infoRequest (id) {
  if (!id) throw new Error('[Nyaapi]: No ID given on request demand.')

  const { data } = await this.cli.get(`/view/${id}`)

  return data
}

module.exports = {
  infoRequest
}
