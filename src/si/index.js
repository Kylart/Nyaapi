const { list, search, searchAll, searchAllByUser, searchByUser, searchByUserAndByPage, searchPage } = require('./search.js')
const { infoRequest } = require('./info.js')
const { upload } = require('./upload.js')

module.exports = {
  list,
  search,
  searchAll,
  searchPage,
  searchByUser,
  searchAllByUser,
  searchByUserAndByPage,
  infoRequest,
  upload
}
