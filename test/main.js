const colors = require('colors')
const ping = require('ping')
const expect = require('chai').expect
const path = require('path')
const main = require(path.join(__dirname, '..', 'index.js'))

const fansub = 'HorribleSubs!'
const quality = '720p'
const anime = 'Youjo senki'
const number = 18

before(() => {
  console.log('Checking if Nyaa.se is up.'.yellow)
  ping.sys.probe('nyaa.se', (isAlive) => {
    if (!isAlive) 
      {
        console.log('Nyaa.se is down... Quitting.'.red)
        process.exit(1)
      }
    else  console.log('Everything ok, processing to tests.'.green)
  })
})

describe('Looking for', () => {
  describe(`"${fansub} ${quality} " results`, () => {
    it('should return 18 results', function () {
      this.timeout(1500)

      return main.searchTerm(`${fansub} ${quality}`, number).then((result) => {
        expect(result.items.length).to.equal(18)
      })
    })
  })
  describe(`"${fansub} ${quality} ${anime}" results`, () => {
    it('should return some results', function () {
      this.timeout(1500)

      return main.searchTerm(`${fansub} ${quality}`, number).then((result) => {
        expect(result.items.length).to.be.above(1)
      })
    })
  })
})