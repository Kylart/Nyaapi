const parseString = require('xml2js').parseString
const req = require('req-fast')

const searchTerm = (term, number = null) => {
  const t1 = new Date()

  return new Promise((resolve, reject) => {
    req(`https://www.nyaa.se/?page=rss&cats=1_0&filter=0&term=${term.replace(' ', '+')}`, (err, resp) => {
      if (err) throw reject(err)

      const xml = resp.body

      parseString(xml, (err, result) => {
        if (err) reject(err)

        const t2 = new Date()
        const duration = (t2 - t1) / 1000

        const torrents = result.rss.channel[0].item

        if (!number) number = torrents.length

        const statMsg = `[Nyaa]: ${number} torrents gathered in ${duration}s.`

        resolve({
          items: torrents.slice(0, number),
          statMsg: statMsg
        })
      })
    })
  })
}

module.exports = {
  searchTerm
}