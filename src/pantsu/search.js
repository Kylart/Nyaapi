const axios = require('axios')
const _ = require('lodash')

const URI = require('./url.json').url

/**
 *
 * Research anything you desire on nyaa.pantsu.cat
 *
 * @param {string} term Keywords describing the research
 * @param {number} n Number of results wanted (Defaults to null)
 * @param {object} opts Research options as described on the official documentation (optional)
 *
 * @returns {promise}
 */

const search = (term, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(URI + 'search', {
      params: {
        c: opts.c || [],
        q: term || opts.q,
        page: opts.page || null,
        limit: n || 99999,
        userID: opts.userID || null,
        fromID: opts.fromID || null,
        s: opts.s || null,
        maxage: opts.maxage || null,
        toDate: opts.toDate || null,
        fromDate: opts.fromDate || null,
        minSize: opts.minSize || null,
        maxSize: opts.maxSize || null,
        sizeType: opts.sizeType || null,
        sort: opts.sort || null,
        order: opts.order || null,
        lang: opts.lang || null
      }
    })
      .then(({data}) => resolve(data.torrents))
      .catch(err => reject(err))
  })
}

/**
 *
 * Research anything you desire on nyaa.pantsu.cat every single result.
 *
 * @param {string} term Keywords describing the research
 * @param {object} opts Research options as described on the official documentation (optional)
 * @param {boolean} silence Should nyaapi give some details?
 *
 * @returns {promise}
 */

const searchAll = (term, opts = {}, silence = true) => {
  return new Promise(async (resolve, reject) => {
    let results = []
    opts.page = 1

    try {
      let torrents = await search(term, null, opts)

      while (torrents.length !== 0) {
        ++opts.page
        results = _.concat(results, torrents)
        torrents = await search(term, null, opts)
      }

      !silence && console.log(`[Nyaa]: Scrapped ${opts.page} page${opts.page === 1 ? '' : 's'} to get ${results.length} results.`)

      resolve(results)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  search,
  searchAll
}
