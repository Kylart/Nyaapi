const search = require('./search.js')
const upload = require('./upload.js')

module.exports = {
  ...search,
  ...upload
}
