const helpers = require('./helpers')

const search = require('./search.js')
const info = require('./info.js')
const upload = require('./upload.js')

module.exports = {
  ...helpers,
  cli: helpers.config.cli,

  ...search,
  ...info,
  ...upload
}
