const request = require('request-promise')
const omit = require('lodash.omit')

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
    opts = omit(opts, 'n')

    request.get(URI + 'search', {
      qs: opts
    })
      .then((data) => resolve(JSON.parse(data).torrents))
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

const searchAll = async (term, opts = {}) => {
  if (!term || (typeof term === 'object' && !term.term)) {
    throw new Error('[Nyaapi]: No term given on search demand.')
  }

  if (typeof term === 'object') {
    opts = term
    term = opts.term
  }

  let results = []
  let torrents = []
  opts.page = 1
  let _continue = true

  while (_continue && opts.page < 4) {
    // We stop at 900 results, that should be enough
    torrents = await search(term, null, opts)
    ++opts.page
    results = results.concat(torrents)

    _continue = torrents.length
  }

  return results
}

/**
 *
 * List specific category on nyaa.pantsu.cat
 *
 * @param {string} c    Category to list.
 * @param {number} p    Page of the category.
 * @param {Object} opts Research options as described on the official documentation (optional).
 *
 * @returns {promise}
 */

const list = (c, p = 1, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof c === 'object') {
      opts = c
      c = opts.c
    }

    opts.c = c || []
    opts.page = p || 1
    opts.limit = opts.n || 100
    opts = omit(opts, 'n')

    request.get(URI + 'search', {
      qs: opts
    })
      .then((data) => resolve(JSON.parse(data).torrents))
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

module.exports = {
  list,
  search,
  searchAll
}
