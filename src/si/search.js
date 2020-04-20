const request = require('request-promise')
const { extractFromHTML } = require('./scrap.js')

const URI = require('./url.json').url
const timeout = (time) => new Promise(resolve => setTimeout(resolve, time))

/**
 * Allows to scrap only one specific page of a research.
 *
 * @param {string} term Keywords describing the research.
 * @param {number} p    The page you want to look for.
 * @param {object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchPage = (term = '', p, opts = {}, includeMaxPage) => {
  return new Promise((resolve, reject) => {
    if (!term) {
      reject(new Error('[Nyaapi]: No term was given on search demand.'))
      return
    }

    if (typeof term === 'object') {
      opts = term
      term = opts.term
      p = p || opts.p
    }

    if (!p) {
      reject(new Error('[Nyaapi]: No page number was given on search page demand.'))
      return
    }

    request.get(URI, {
      qs: {
        f: opts.filter || 0,
        c: opts.category || '1_0',
        q: term,
        p: p,
        s: opts.sort || 'id',
        o: opts.direction || 'desc'
      }
    })
      .then((data) => {
        const results = extractFromHTML(data, includeMaxPage)

        resolve(results)
      })
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

/**
 *
 * Research anything you desire on nyaa.si and get all the results.
 *
 * @param {string} term Keywords describing the research.
 * @param {Object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchAll = async (term = '', opts = {}) => {
  if (!term || (typeof term === 'object' && !term.term)) {
    throw new Error('[Nyaapi]: No search term was given.')
  }

  if (typeof term === 'object') {
    opts = term
    term = opts.term
  }

  const { results: fResults, maxPage } = await searchPage(term, 1, opts, true)
  const searchs = []
  for (let page = 2; page <= maxPage; ++page) {
    const makeSearch = () =>
      searchPage(term, page, opts)
        .catch(e => timeout(1000).then(makeSearch))
    searchs.push(makeSearch())
  }

  const results = await Promise.all(searchs)

  return results.reduce((c, v) => c.concat(v), fResults)
}

/**
 *
 * Research anything you desire on nyaa.si.
 *
 * @param {string} term Keywords describing the research.
 * @param {number} n    Number of results wanted (Defaults to null).
 * @param {Object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const search = async (term = '', n = null, opts = {}) => {
  if (!term || (typeof term === 'object' && !term.term)) {
    throw new Error('[Nyaapi]: No term given on search demand.')
  }

  if (typeof term === 'object') {
    opts = term
    term = opts.term
    n = n || opts.n
  }

  // If there is no n, then the user's asking for all the results, right?
  if (!n) {
    return searchAll(term, opts)
  } else {
    let results = []
    let tmpData = []
    let _continue = true
    let page = 1
    const maxPage = Math.ceil(n / 75)

    while (_continue && page <= maxPage) {
      tmpData = await searchPage(term, page, opts)
      results = results.concat(tmpData)
      ++page
      _continue = tmpData.length
    }

    return results.slice(0, n)
  }
}

/**
 *
 * Research anything you desire according to a certain user and a specific page on nyaa.si.
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {number} p    The page you want to look for.
 * @param {number} n    Number of results wanted on this page (Defaults to null).
 * @param {Object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchByUserAndByPage = async (user = null, term = '', p = null, n = null, opts = {}) => {
  if (!user) throw new Error('[Nyaapi]: No user given on search demand.')

  if (typeof user === 'object') {
    opts = user
    user = opts.user
    p = opts.p
    term = term || opts.term
    n = n || opts.n || 75
  }

  if (!p) throw new Error('[Nyaapi]: No page given on search by page demand.')

  const data = await request.get(`${URI}user/${user}`, {
    qs: {
      f: opts.filter || 0,
      c: opts.category || '1_0',
      q: term || '',
      p
    }
  })

  const results = extractFromHTML(data)

  return results.slice(0, n || results.length)
}

/**
 *
 * Research anything you desire according to a certain user on nyaa.si and get all the results.
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {Object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchAllByUser = async (user = null, term = '', opts = {}) => {
  if (!user || (typeof user === 'object' && user && !user.user)) {
    throw new Error('[Nyaapi]: No user was given.')
  }

  if (typeof user === 'object') {
    opts = user
    term = opts.term
    user = opts.user
  }

  let page = 1
  let results = []
  let tmpData = []
  let _continue = true

  while (_continue && page <= 15) {
    // We stop at page === 15 because nyaa.si offers a maximum of 1000 results on standard research
    results = results.concat(tmpData)

    opts.user = user
    opts.term = term
    opts.p = page

    tmpData = await searchByUserAndByPage(opts)
    ++page

    _continue = tmpData.length
  }

  return results
}

/**
 *
 * Research anything you desire according to a certain user on nyaa.si
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {number} n    Number of results wanted on this page (Defaults to null).
 * @param {Object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchByUser = async (user = null, term = '', n = null, opts = {}) => {
  if (!user || (typeof user === 'object' && user && !user.user)) {
    throw new Error('[Nyaapi]: No user given on search demand.')
  }

  if (typeof user === 'object') {
    opts = user
    user = opts.user
    term = term || opts.term || ''
    n = n || opts.n
  }

  // If there is no n, then the user's asking for all the results, right?
  if (!n) {
    return searchAllByUser(user, term, opts)
  } else {
    let results = []
    let tmpData = []
    let page = 1
    let _continue = true
    const maxPage = Math.ceil(n / 75)

    while (_continue && page <= maxPage) {
      opts.user = user
      opts.term = term
      opts.p = page

      tmpData = await searchByUserAndByPage(opts)
      results = results.concat(tmpData)
      ++page
      _continue = tmpData.length
    }

    return results.slice(0, n)
  }
}

/**
 * List specific category on nyaa.si.
 *
 * @param {string} c    Category to list.
 * @param {number} p    Page of the category.
 * @param {object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const list = (c, p, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof c === 'object') {
      opts = c
      c = opts.c
      p = p || opts.p
    }

    request.get(URI, {
      qs: {
        f: opts.filter || 0,
        c: c || '1_0',
        p: p || 1,
        s: opts.sort || 'id',
        o: opts.direction || 'desc'
      }
    })
      .then((data) => {
        const results = extractFromHTML(data, true)
        resolve(results)
      })
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

module.exports = {
  list,
  search,
  searchAll,
  searchPage,
  searchByUser,
  searchAllByUser,
  searchByUserAndByPage
}
