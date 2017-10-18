const search = require('./search.js')
const info = require('./info.js')
const upload = require('./upload.js')
const update = require('./update.js')
const login = require('./login')
const checkUser = require('./checkUser.js')

module.exports = {
  ...search,
  ...info,
  ...upload,
  ...update,
  ...login,
  ...checkUser
}
