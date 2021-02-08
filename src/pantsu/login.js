/**
 * Allows to log into nyaa.pantsu.cat
 *
 * @param {Object} credentials Object containing a username aong with its password.
 * @param {String} credentials.username Your username
 * @param {String} credentials.password Your password
 *
 * @returns {promise}
 */
async function login (credentials = {}) {
  if (!credentials.username || !credentials.password) {
    throw new Error('[Nyaapi]: No username or password were given on login demand.')
  }

  const { data } = await this.cli.post('/login', credentials)

  return data
}

module.exports = {
  login
}
