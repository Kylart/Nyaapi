const { list, search, searchAll } = require('./search.js')
const { infoRequest } = require('./info.js')
const { upload } = require('./upload.js')
const { update } = require('./update.js')
const { login } = require('./login')
const { checkUser } = require('./checkUser.js')
const { checkHeader } = require('./header.js')
const { config } = require('./config.js')

module.exports = {
  list,
  search,
  searchAll,
  infoRequest,
  upload,
  update,
  login,
  checkUser,
  checkHeader,
  config
}
