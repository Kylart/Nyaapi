const axios = require('axios')
const _ = require('lodash')

const URI = require('./url.json').url

/**
 *
 * Research anything you desire on nyaa.pantsu.cat
 *
 * @param {string} term Keywords describing the research.
 * @param {number} n    Number of results wanted (Defaults to null).
 * @param {Object} opts Research options as described on the official documentation (optional).
 *
 * @returns {promise}
 */

const search = (term, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (!term || (typeof term === 'object' && !term.term)) {
      reject(new Error('[Nyaapi]: No term given on search demand.'))
      return
    }

    if (typeof term === 'object') {
      opts = term
      term = opts.term
      n = opts.n
    }

    opts.c = opts.c || []
    opts.q = term
    opts.limit = n || 99999
    opts = _.omit(opts, 'n')

    axios.get(URI + 'search', {
      params: opts
    })
      .then(({data}) => resolve(data.torrents))
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

/**
 *
 * Research anything you desire on nyaa.pantsu.cat every single result.
 *
 * @param {string} term Keywords describing the research.
 * @param {Object} opts Research options as described on the official documentation (optional).
 *
 * @returns {promise}
 */

const searchAll = (term, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!term || (typeof term === 'object' && !term.term)) {
      reject(new Error('[Nyaapi]: No term given on search demand.'))
      return
    }

    if (typeof term === 'object') {
      opts = term
      term = opts.term
    }

    let results = []
    let torrents = []
    opts.page = 1
    let _continue = true

    try {
      while (_continue && opts.page < 4) {
        // We stop at 900 results, that should be enough
        torrents = await search(term, null, opts)
        ++opts.page
        results = _.concat(results, torrents)

        _continue = torrents.length
      }

      resolve(results)
    } catch (e) {
      /* istanbul ignore next */
      reject(e)
    }
  })
}

module.exports = {
  search,
  searchAll
}
