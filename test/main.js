const colors = require('colors')
const axios = require('axios')
const expect = require('chai').expect
const path = require('path')
const main = require(path.join(__dirname, '..', 'index.js'))

const fansub = '[HorribleSubs]'
const quality = '720p'
const anime = 'Youjo senki'
const number = 18

describe('Nyaa.pantsu.cat', () => {
  describe(`"${fansub} ${quality} " results`, () => {
    it('should return 18 results', function () {
      this.timeout(5000)

      return main.searchPantsu(`${fansub} ${quality}`, number).then(data => {
        expect(data.length).to.equal(18)
      })
    })
  })
  describe(`"${fansub} ${quality} ${anime}" results`, () => {
    it('should return some results', function () {
      this.timeout(5000)

      return main.searchPantsu(`${fansub} ${quality}`, number).then(data => {
        expect(data.length).to.be.above(1)
      })
    })
  })
  describe('Wrong research: [HorribleSabs] 570p', () => {
    it('should not have any result', function () {
      this.timeout(1500)

      return main.searchPantsu('[HorribleSabs] 570p', number).catch(err => {
        expect(err.message).to.equal('[Nyaa]: No result found...')
      })
    })
  })
})

describe('Nyaa.si', () => {
  describe(`"${fansub} ${quality} " results`, () => {
    it('should return 18 results', function () {
      this.timeout(1500)

      return main.searchSi(`${fansub} ${quality}`, number).then(data => {
        expect(data.length).to.equal(18)
      })
    })
  })
  describe(`"${fansub} ${quality} ${anime}" results`, () => {
    it('should return some results', function () {
      this.timeout(1500)

      return main.searchSi(`${fansub} ${quality}`, number).then(data => {
        expect(data.length).to.be.above(1)
      })
    })
  })
  describe('Wrong research: [HorribleSabs] 570p', () => {
    it('should not have any result', function () {
      this.timeout(1500)

      return main.searchSi('[HorribleSabs] 570p', number).catch(err => {
        expect(err.message).to.equal('[Nyaa]: No result found...')
      })
    })
  })
})
