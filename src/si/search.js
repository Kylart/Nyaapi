const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')

const URI = require('./url.json').url

/**
 * Allows to scrap only one specific page of a research
 *
 * @param {string} term Keywords describing the research.
 * @param {number} p The page you want to look for.
 * @param {object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const searchPage = (term = null, p, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof term === 'object') {
      opts = term
      term = opts.term
      p = p || opts.p
    }

    if (!term) reject(new Error('[Nyaapi]: No term was given on search demand.'))
    if (!p) reject(new Error('[Nyaapi]: No page number was given on search page demand.'))

    axios.get(URI, {
      params: {
        f: opts.filter || 0,
        c: opts.category || '1_0',
        q: term,
        p: p
      }
    })
      .then(({data}) => {
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

        resolve(results)
      })
      .catch((err) => reject(err))
  })
}

/**
 *
 * Research anything you desire on nyaa.si
 *
 * @param {string} term Keywords describing the research
 * @param {Object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const searchAll = (term = null, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    let page = 1
    let results = []
    let tmpData = []

    if (!term) {
      reject(new Error('[Nyaapi]: No search term was given.'))
    }

    if (typeof term === 'object') {
      opts = term
      term = opts.term
    }

    while (page <= 15) {
      // We stop at page === 15 because nyaa.si offers a maximum of 1000 results
      // which means 14 pages of 75 results with the last one containing only 25.
      try {
        results = _.concat(results, tmpData)

        tmpData = await searchPage(term, page, opts)
        ++page
      } catch (e) {
        reject(e)
      }
    }

    resolve(results)
  })
}

/**
 *
 * Research anything you desire on nyaa.si
 *
 * @param {string} term Keywords describing the research
 * @param {number} n Number of results wanted (Defaults to null)
 * @param {Object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const search = (term = null, n = null, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (typeof term === 'object') {
      opts = term
      term = opts.term
      n = n || opts.n
    }

    // If there is no n, then the user's asking for all the results, right?
    if (!n) {
      resolve(searchAll(term, opts))
    } else {
      let results = []
      let tmpData = []
      let page = 1
      const maxPage = Math.ceil(n / 75)

      while (page <= maxPage) {
        try {
          tmpData = await searchPage(term, page, opts)
          results = _.concat(results, tmpData)
          ++page
        } catch (e) {
          reject(e)
        }
      }

      resolve(results.slice(0, n))
    }
  })
}

/**
 *
 * Research anything you desire according to a certain user on nyaa.si
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {number} n Number of results wanted (Defaults to null).
 * @param {Object} opts Research options as described on the official documentation (optional).
 *
 * @returns {promise}
 */

const searchByUser = (user, term, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {

  })
}

module.exports = {
  search,
  searchAll,
  searchPage,
  searchByUser
}
