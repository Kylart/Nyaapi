const { createReadStream } = require('fs')

const FormData = require('form-data')

/**
 *
 * @typedef {Object} UploadOpts
 * @property {Object} credentials
 * @property {Stirng} username
 * @property {Stirng} password
 * @property {String} torrent Path to the torrent file
 * @property {String} category Valid nyaa.si category
 * @property {String} name
 * @property {String} [information]
 * @property {String} [description]
 * @property {Boolean} [anonymous]
 * @property {Boolean} [hidden]
 * @property {Boolean} [complete]
 * @property {Boolean} [remake]
 * @property {Boolean} [trusted]
 *
 * @typedef {Object} NyaaUploadError
 * @property {Object} errors
 * @property {String[]} errors.torrent
 */

/**
 * Allows to upload file or magnet to nyaa.si
 *
 * @param {UploadOpts} opts Object description all the information to upload
 *
 * @returns {Promise<Object | Error | NyaaUploadError>}
 */
async function upload (opts) {
  if (!opts.credentials) {
    throw new Error('[Nyaapi]: No credentials given on upload demand.')
  }

  if (!opts.torrent) {
    throw new Error('[Nyaapi]: No torrent file given on upload demand.')
  }

  if (!opts.name) {
    throw new Error('[Nyaapi]: No name given on upload demand.')
  }

  if (!opts.category) {
    throw new Error('[Nyaapi]: No category given on upload demand.')
  }

  const form = new FormData()
  form.append('torrent', createReadStream(opts.torrent))
  form.append('torrent_data', JSON.stringify({
    name: opts.name,
    category: opts.category,
    information: opts.information,
    description: opts.description,
    anonymous: opts.anonymous,
    hidden: opts.hidden,
    complete: opts.complete,
    remake: opts.remake,
    trusted: opts.trusted
  }))

  const { data } = await this.cli.post(
    '/api/upload',
    form, {
      auth: opts.credentials,
      headers: {
        ...form.getHeaders()
      }
    }
  )

  return data
}

module.exports = {
  upload
}
