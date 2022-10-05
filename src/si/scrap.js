const cheerio = require('cheerio')

const { url } = require('./helpers/config')

function extractFromHTML (data, includeMaxPage = false) {
  const $ = cheerio.load(data)
  const baseUrl = url
  const results = []

  const _getChild = (ctx, nb) => {
    return $(ctx).find(`td:nth-child(${nb})`)
  }

  $('tr').slice(1).each(function () {
    // speical handling for hash, as very rarely the download option will be unavailable and missing.
    let hash = ""
    let magnetElement = _getChild(this, 3).find('a:nth-child(2)').attr('href')
    if (!magnetElement) 
      magnetElement = _getChild(this, 3).find('a:nth-child(1)').attr('href')
    // magnetElement is assumed to be valid, if the magnet option is unavailable the torrent wouldn't be present.
    hash = magnetElement.match(/btih:(\w+)/)[1]

    const result = {
      id: _getChild(this, 2).find('a:not(.comments)').attr('href').replace('/view/', ''),
      name: _getChild(this, 2).find('a:not(.comments)').text().trim(),
      hash: hash,
      date: new Date(_getChild(this, 5).attr('data-timestamp') * 1000).toISOString(),
      filesize: _getChild(this, 4).text(),
      category: _getChild(this, 1).find('a').attr('href').replace('/?c=', '').replace(/\d{1,2}$/, '0'),
      sub_category: _getChild(this, 1).find('a').attr('href').replace('/?c=', ''),
      magnet: magnetElement,
      torrent: baseUrl + _getChild(this, 3).find('a:nth-child(1)').attr('href'),
      seeders: _getChild(this, 6).text(),
      leechers: _getChild(this, 7).text(),
      completed: _getChild(this, 8).text(),
      status: $(this).attr('class')
    }

    results.push(result)
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

function extractPageFromHTML (data) {
  const $ = cheerio.load(data)
  const baseUrl = url

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
