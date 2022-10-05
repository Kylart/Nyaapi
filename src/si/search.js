const { extractFromHTML } = require('./scrap.js')

const timeout = (time) => new Promise(resolve => setTimeout(resolve, time))

/**
 * Allows to scrap only one specific page of a research.
 *
 * @param {string} term Keywords describing the research.
 * @param {number} p    The page you want to look for.
 * @param {object} opts Research options as described on the documentation.
 */
async function searchPage (term = '', p, opts = {}, includeMaxPage) {
  if (!term) throw new Error('[Nyaapi]: No term was given on search demand.')

  if (typeof term === 'object') {
    opts = term
    term = opts.term
    p = p || opts.p
  }

  if (!p) throw new Error('[Nyaapi]: No page number was given on search page demand.')

  const { data } = await this.cli.get('/', {
    params: {
      f: opts.filter || 0,
      c: opts.category || '1_0',
      q: term,
      p: p,
      s: opts.sort || 'id',
      o: opts.direction || 'desc'
    }
  })

  return extractFromHTML(data, includeMaxPage)
}

/**
 * Research anything you desire on nyaa.si and get all the results.
 *
 * @param {string} term Keywords describing the research.
 * @param {Object} opts Research options as described on the documentation.
 */
async function searchAll (term = '', opts = {}) {
  if (!term || (typeof term === 'object' && !term.term)) {
    throw new Error('[Nyaapi]: No search term was given.')
  }

  if (typeof term === 'object') {
    opts = term
    term = opts.term
  }

  const { results: tempResults, maxPage } = await this.searchPage(term, 1, opts, true)

  const searchs = []
  for (let page = 2; page <= maxPage; ++page) {
    const makeSearch = () =>
      this.searchPage(term, page, opts)
        .catch(e => timeout(1000).then(makeSearch))

    searchs.push(makeSearch())
  }

  const results = await Promise.all(searchs)

  return results.reduce((acc, result) => acc.concat(result), tempResults)
}

/**
 * Research anything you desire on nyaa.si.
 *
 * @param {string} term Keywords describing the research.
 * @param {number} n    Number of results wanted (Defaults to null).
 * @param {Object} opts Research options as described on the documentation.
 */
async function search (term = '', n = null, opts = {}) {
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
    return this.searchAll(term, opts)
  } else {
    let results = []
    let tmpData = []
    let _continue = true
    let page = 1
    const maxPage = Math.ceil(n / 75)

    while (_continue && page <= maxPage) {
      tmpData = await this.searchPage(term, page, opts)
      results = results.concat(tmpData)
      ++page
      _continue = tmpData.length
    }

    return results.slice(0, n)
  }
}

/**
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
async function searchByUserAndByPage (user = null, term = '', p = null, n = null, opts = {}) {
  if (!user) throw new Error('[Nyaapi]: No user given on search demand.')

  if (typeof user === 'object') {
    opts = user
    user = opts.user
    p = opts.p
    term = term || opts.term
    n = n || opts.n || 75
  }

  if (!p) throw new Error('[Nyaapi]: No page given on search by page demand.')

  const { data } = await this.cli.get(`/user/${user}`, {
    params: {
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
 * Research anything you desire according to a certain user on nyaa.si and get all the results.
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {Object} opts Research options as described on the documentation.
 */
async function searchAllByUser (user = null, term = '', opts = {}) {
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

  while (page <= 15) {
    // We stop at page === 15 because nyaa.si offers a maximum of 1000 results on standard research
    results = results.concat(tmpData)

    opts.user = user
    opts.term = term
    opts.p = page

    try {
      tmpData = await this.searchByUserAndByPage(opts)
      ++page
    } catch (e) {
      if (e.statusCode !== 404) { throw e }

      break
    }
  }

  return results
}

/**
 * Research anything you desire according to a certain user on nyaa.si
 *
 * @param {string} user The user you want to spy on.
 * @param {string} term Keywords describing the research.
 * @param {number} n    Number of results wanted on this page (Defaults to null).
 * @param {Object} opts Research options as described on the documentation.
 */
async function searchByUser (user = null, term = '', n = null, opts = {}) {
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
    return this.searchAllByUser(user, term, opts)
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

      tmpData = await this.searchByUserAndByPage(opts)
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
 */
async function list (c, p, opts = {}) {
  if (typeof c === 'object') {
    opts = c
    c = opts.c
    p = p || opts.p
  }

  const { data } = await this.cli.get('/', {
    params: {
      f: opts.filter || 0,
      c: c || '1_0',
      p: p || 1,
      s: opts.sort || 'id',
      o: opts.direction || 'desc'
    }
  })

  return extractFromHTML(data, true)
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
