const omit = require('lodash.omit')

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
async function search (term, n = null, opts = {}) {
  if (!term || (typeof term === 'object' && !term.term)) {
    throw new Error('[Nyaapi]: No term given on search demand.')
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

  const { data } = await this.cli.get('/search', {
    params: opts
  })

  return data.torrents
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
async function searchAll (term, opts = {}) {
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
    torrents = await this.search(term, null, opts)
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
async function list (c, p, opts = {}) {
  if (typeof c === 'object') {
    opts = c
    c = opts.c
    p = p || opts.p
  }

  opts.c = c || []
  opts.page = p || 1
  opts.limit = opts.n || 100
  opts = omit(opts, 'n')

  const { data } = await this.cli.get('/search', { params: opts })

  return data.torrents
}

module.exports = {
  list,
  search,
  searchAll
}
