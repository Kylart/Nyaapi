const axios = require('axios')

const URI = require('./url.json').url

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
      reject(new Error('[Nyaapi]: No username was given on user check demand.'))
    }

    axios.get(URI + 'profile', {
      params: {id}
    })
      .then(({data}) => resolve(data))
      .catch((err) => reject(err))
  })
}

module.exports = {
  checkUser
}
