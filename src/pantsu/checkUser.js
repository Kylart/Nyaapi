const request = require('request-promise')

const { config } = require('./config.js')

/**
 * Allows to check a user profile from its ID.
 *
 * @param {number|string} id The ID of the user you want to check the profile.
 *
 * @returns {promise}
 */

const checkUser = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject(new Error('[Nyaapi]: No ID was given on user check demand.'))
      return
    }

    request.get(config.url + 'profile', {
      qs: { id }
    })
      .then((data) => resolve(JSON.parse(data)))
      .catch(/* istanbul ignore next */ (err) => reject(err))
  })
}

module.exports = {
  checkUser
}
