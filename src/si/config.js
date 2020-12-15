const config = {
  url: 'https://nyaa.si/',
  changeBaseUrl: newValue => {
    config.url = newValue
  }
}

module.exports = {
  config
}
