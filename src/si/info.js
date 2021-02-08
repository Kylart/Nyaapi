const { extractPageFromHTML } = require('./scrap.js')

/**
 * @typedef {Object} TorrentInfo
 * @property {Number} id
 * @property {Object} info
 * @property {String} info.category
 * @property {String} info.completed
 * @property {String} info.date
 * @property {String} info.description
 * @property {String} info.filesize
 * @property {String} info.hash
 * @property {String} info.leechers
 * @property {String} info.magnet
 * @property {String} info.name
 * @property {String} info.seeders
 * @property {String} info.sub_category
 * @property {String} info.torrent
 * @property {String} info.uploader_name
 */

/**
 * Request torrent information according to its ID.
 *
 * @param {Number} id The ID of the torrent you want information of.
 *
 * @returns {Promise<TorrentInfo>}
 */
async function infoRequest (id) {
  if (!id || isNaN(+id)) throw new Error('[Nyaapi]: No ID given on request demand.')

  const { data } = await this.cli.get(`/view/${id}`)

  return {
    id,
    info: extractPageFromHTML(data)
  }
}

module.exports = {
  infoRequest
}
