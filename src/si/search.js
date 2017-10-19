const axios = require('axios')
const _ = require('lodash')
const {extractFromHTML} = require('./scrap.js')

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
        const results = extractFromHTML(data)

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

const searchByUser = (user = null, term = null, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {

  })
}

module.exports = {
  search,
  searchAll,
  searchPage,
  searchByUser
}
