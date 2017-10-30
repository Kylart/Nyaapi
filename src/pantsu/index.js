const {search, searchAll} = require('./search.js')
const {infoRequest} = require('./info.js')
const {upload} = require('./upload.js')
const {update} = require('./update.js')
const {login} = require('./login')
const {checkUser} = require('./checkUser.js')
const {checkHeader} = require('./header.js')

module.exports = {
  search,
  searchAll,
  infoRequest,
  upload,
  update,
  login,
  checkUser,
  checkHeader
}
