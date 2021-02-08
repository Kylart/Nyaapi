/**
 * Allows to check a user profile from its ID.
 *
 * @param {number|string} id The ID of the user you want to check the profile.
 */

async function checkUser (id) {
  if (!id) throw new Error('[Nyaapi]: No ID was given on user check demand.')

  const { data } = await this.cli.get('/profile', {
    params: { id }
  })

  return data
}

module.exports = {
  checkUser
}
