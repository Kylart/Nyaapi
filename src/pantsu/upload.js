const fs = require('fs')
const FormData = require('form-data')

/**
 * Allows the uploading of torrent file to nyaa.pantsu.cat
 *
 * @param {Object} opts Options.
 *
 * @returns {Promise<Object>}
 */
async function upload (opts = {}) {
  if ((!opts.magnet && !opts.torrent) || !opts.token || !opts.username) {
    throw new Error('[Nyaapi]: No file/torrent, token or username were given.')
  }

  if (opts.torrent) {
    opts.torrent = fs.createReadStream(opts.torrent)
  }

  const form = new FormData()

  Object.entries(opts)
    .forEach(([key, value]) => {
      if (key === 'torrent') return form.append('torrent', fs.createReadStream(opts.torrent))
      if (key === 'token') return

      form.append(key, value)
    })

  return this.cli.post(
    '/upload',
    form, {
      headers: {
        Authorization: opts.token,
        ...form.getHeaders()
      }
    }
  )
}

module.exports = {
  upload
}
