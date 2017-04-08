const expect = require('chai').expect
const path = require('path')
const main = require(path.join(__dirname, '..', 'index.js'))

const fansub = 'HorribleSubs!'
const quality = '720p'
const anime = 'Youjo senki'
const number = 18

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