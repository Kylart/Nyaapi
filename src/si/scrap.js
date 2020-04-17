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

const extractPageFromHTML = (data) => {
  const $ = cheerio.load(data)
  const baseUrl = URI.slice(0, -1)

  return {
    name: $('.panel-heading > .panel-title').eq(0).text().trim(),
    hash: $('div > kbd').text().trim().toLowerCase(),
    date: new Date($('div[class="col-md-1"]:contains("Date:")').next().attr('data-timestamp') * 1000).toISOString(),
    filesize: $('div[class="col-md-1"]:contains("File size:")').next().text(),
    description: $('#torrent-description').text(),
    category: $('div[class="col-md-5"] > a').eq(0).attr('href').replace('/?c=', ''),
    sub_category: $('div[class="col-md-5"] > a').eq(1).attr('href').replace('/?c=', ''),
    uploader_name: $('div[class="col-md-1"]:contains("Submitter:")').next().text().trim(),
    magnet: $('.panel-footer > a').eq(1).attr('href'),
    torrent: baseUrl + $('.panel-footer > a').eq(0).attr('href'),
    seeders: $('div[class="col-md-1"]:contains("Seeders:")').next().children().first().text(),
    leechers: $('div[class="col-md-1"]:contains("Leechers:")').next().children().first().text(),
    completed: $('div[class="col-md-1"]:contains("Completed:")').next().text()
  }
}

module.exports = {
  extractFromHTML,
  extractPageFromHTML
}
