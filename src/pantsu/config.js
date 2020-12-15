const config = {
  url: 'https://nyaa.net/api/',
  changeURL: function (newValue) {
    config.url = newValue
  }
}

module.exports = {
  config
}
