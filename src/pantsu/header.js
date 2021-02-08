/**
 * Allows to request torrent's head its ID.
 *
 * @param {number|string} id The ID of the torrent.
 *
 * @returns {promise}
 */
async function checkHeader (id) {
  if (!id) throw new Error('[Nyaapi]: No ID was given on torrent head request.')

  const { data } = await this.cli.get(`/view/${id}`)

  return data
}

module.exports = {
  checkHeader
}
