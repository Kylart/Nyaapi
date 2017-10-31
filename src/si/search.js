const axios = require('axios')
const _ = require('lodash')
const {extractFromHTML} = require('./scrap.js')

const URI = require('./url.json').url

/**
 * Allows to scrap only one specific page of a research.
 *
 * @param {string} term Keywords describing the research.
 * @param {number} p    The page you want to look for.
 * @param {object} opts Research options as described on the documentation.
 *
 * @returns {promise}
 */

const searchPage = (term = '', p, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (!term) reject(new Error('[Nyaapi]: No term was given on search demand.'))

    if (typeof term === 'object') {
      opts = term
      term = opts.term
      p = p || opts.p
    }

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

const searchAll = (term = '', opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!term || (typeof term === 'object' && !term.term)) {
      reject(new Error('[Nyaapi]: No search term was given.'))
      return
    }

    if (typeof term === 'object') {
      opts = term
      term = opts.term
    }

    let page = 1
    let results = []
    let tmpData = []
    let _continue = true

    while (_continue && page <= 15) {
      // We stop at page === 15 because nyaa.si offers a maximum of 1000 results
      // which means 14 pages of 75 results with the last one containing only 25.
      try {
        results = _.concat(results, tmpData)

        tmpData = await searchPage(term, page, opts)
        ++page

        _continue = tmpData.length
      } catch (e) {
        /* istanbul ignore next */
        reject(e)
      }
    }

    resolve(results)
  })
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

const search = (term = '', n = null, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!term || (typeof term === 'object' && !term.term)) {
      reject(new Error('[Nyaapi]: No term given on search demand.'))
      return
    }

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
          /* istanbul ignore next */
          reject(e)
        }
      }

      resolve(results.slice(0, n))
    }
  })
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

const searchByUserAndByPage = (user = null, term = '', p = null, n = null, opts = {}) => {
  return new Promise((resolve, reject) => {
    if (!user) reject(new Error('[Nyaapi]: No user given on search demand.'))

    if (typeof user === 'object') {
      opts = user
      user = opts.user
      p = opts.p
      term = term || opts.term
      n = n || opts.n || 75
    }

    if (!p) reject(new Error('[Nyaapi]: No page given on search by page demand.'))

    axios.get(`${URI}user/${user}`, {
      params: {
        f: opts.filter || 0,
        c: opts.category || '1_0',
        q: term || '',
        p
      }
    })
      .then(({data}) => {
        const results = extractFromHTML(data)

        resolve(results.slice(0, n || results.length))
      })
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
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

const searchAllByUser = (user = null, term = '', opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!user || (typeof user === 'object' && user && !user.user)) {
      reject(new Error('[Nyaapi]: No user was given.'))
      return
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
      try {
        results = _.concat(results, tmpData)

        opts.user = user
        opts.term = term
        opts.p = page

        tmpData = await searchByUserAndByPage(opts)
        ++page

        _continue = tmpData.length
      } catch (e) {
        /* istanbul ignore next */
        reject(e)
      }
    }

    resolve(results)
  })
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

const searchByUser = (user = null, term = '', n = null, opts = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!user || (typeof user === 'object' && user && !user.user)) {
      reject(new Error('[Nyaapi]: No user given on search demand.'))
      return
    }

    if (typeof user === 'object') {
      opts = user
      user = opts.user
      term = term || opts.term || ''
      n = n || opts.n
    }

    // If there is no n, then the user's asking for all the results, right?
    if (!n) {
      resolve(searchAllByUser(user, term, opts))
    } else {
      let results = []
      let tmpData = []
      let page = 1
      const maxPage = Math.ceil(n / 75)

      while (page <= maxPage) {
        try {
          opts.user = user
          opts.term = term
          opts.p = page

          tmpData = await searchByUserAndByPage(opts)
          results = _.concat(results, tmpData)
          ++page
        } catch (e) {
          /* istanbul ignore next */
          reject(e)
        }
      }

      resolve(results.slice(0, n))
    }
  })
}

module.exports = {
  search,
  searchAll,
  searchPage,
  searchByUser,
  searchAllByUser,
  searchByUserAndByPage
}
