const cheerio = require('cheerio')

const URI = require('./url.json').url

const extractFromHTML = (data, includeMaxPage = false) => {
  const $ = cheerio.load(data)
  const baseUrl = URI.slice(0, -1)
  const results = []

  const _getChild = (ctx, nb) => {
    return $(ctx).find(`td:nth-child(${nb})`)
  }

  $('tr').slice(1).each(function () {
    const toPush = {}

    // Scraping category
    toPush.category = {
      label: _getChild(this, 1).find('a').attr('title'),
      code: _getChild(this, 1).find('a').attr('href').replace('/?c=', '')
    }

    // Scraping names
    toPush.name = _getChild(this, 2).find('a:not(.comments)').text().trim()

    // Scraping links for torrent and magnet
    toPush.links = {
      page: baseUrl + _getChild(this, 2).find('a:not(.comments)').attr('href'),
      file: baseUrl + _getChild(this, 3).find('a:nth-child(1)').attr('href'),
      magnet: _getChild(this, 3).find('a:nth-child(2)').attr('href')
    }

    // Scraping some other info
    toPush.fileSize = _getChild(this, 4).text()
    toPush.timestamp = _getChild(this, 5).attr('data-timestamp')
    toPush.seeders = _getChild(this, 6).text()
    toPush.leechers = _getChild(this, 7).text()
    toPush.nbDownload = _getChild(this, 8).text()

    results.push(toPush)
  })

  if (includeMaxPage) {
    /* istanbul ignore next */
    return includeMaxPage
      ? { results, maxPage: +$('ul.pagination li:nth-last-child(2) a').text() }
      : results
  } else {
    return results
  }
}

module.exports = {
  extractFromHTML
}
