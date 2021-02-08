const helpers = require('./helpers')

const search = require('./search.js')
const info = require('./info.js')
const upload = require('./upload.js')
const update = require('./update.js')
const login = require('./login')
const checkUser = require('./checkUser.js')
const checkHeader = require('./header.js')

module.exports = {
  ...helpers,
  cli: helpers.config.cli,

  ...search,
  ...info,
  ...upload,
  ...update,
  ...login,
  ...checkUser,
  ...checkHeader
}
