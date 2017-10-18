const search = require('./search.js')
const info = require('./info.js')
const upload = require('./upload.js')
const update = require('./update.js')
const login = require('./login')
const checkUser = require('./checkUser.js')
const header = require('./header.js')

module.exports = {
  ...search,
  ...info,
  ...upload,
  ...update,
  ...login,
  ...checkUser,
  ...header
}
