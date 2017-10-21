require('colors')
const test = require('ava')

const {si} = require('../src/index.js')

const fansub = 'horriblesubs'
const quality = '720p'
const anime = 'Youjo senki'
const number = 18

test.before('[Si] methods', () => {
  console.log('[Si] methods:'.green)
  Object.keys(si).forEach((key) => {
    console.log(`    > ${key}`.yellow)
  })
})

test(`Search method gives ${number} results with 3 arguments`, async t => {
  try {
    const data = await si.search(anime, number, {filter: 2})

    t.is(data.length, number)
  } catch (e) {
    t.fail()
  }
})

test(`Search method gives ${number} results with 1 object argument`, async t => {
  try {
    const data = await si.search({
      term: anime,
      n: number,
      filter: 2
    })

    t.is(data.length, number)
  } catch (e) {
    t.fail()
  }
})

test(`Search method gives 1000 results with no number`, async t => {
  try {
    const data = await si.search({
      term: fansub,
      filter: 2
    })

    t.is(data.length, 1000)
  } catch (e) {
    t.fail()
  }
})

test('Search method fails if no term is given', async t => {
  try {
    const data = await si.search()
    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test('SearchAll method returns a 1000 results with 1 object argument', async t => {
  try {
    const data = await si.searchAll({
      term: fansub,
      filter: '2'
    })

    t.is(data.length, 1000)
  } catch (e) {
    t.fail()
  }
})

test('SearchAll method returns a 1000 results with 2 arguments', async t => {
  try {
    const data = await si.searchAll(fansub, {
      filter: '2'
    })

    t.is(data.length, 1000)
  } catch (e) {
    t.fail()
  }
})

test('SearchAll method returns an error if no term is given', async t => {
  try {
    const data = await si.searchAll()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test('SearchAll method returns an error if no term in object is given', async t => {
  try {
    const data = await si.searchAll({})

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test('SearchPage method returns 75 results with 1 object argument', async t => {
  try {
    const data = await si.searchPage({
      term: fansub,
      p: 2,
      filter: '2'
    })

    t.is(data.length, 75)
  } catch (e) {
    t.fail()
  }
})

test('SearchPage method returns a 75 results with 3 arguments', async t => {
  try {
    const data = await si.searchPage(fansub, 3, {
      filter: '2'
    })

    t.is(data.length, 75)
  } catch (e) {
    t.fail()
  }
})

test('SearchPage method returns an error if no term is given', async t => {
  try {
    const data = await si.searchPage()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test('SearchPage method returns an error if no page is given', async t => {
  try {
    const data = await si.searchPage(fansub)

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test(`SearchByUser method returns ${number} with 4 arguments`, async t => {
  try {
    const data = await si.searchByUser(fansub, anime, number, {filter: 2})

    t.is(data.length, number)
  } catch (e) {
    t.fail()
  }
})

test(`SearchByUser method returns ${number} with 1 object argument`, async t => {
  try {
    const data = await si.searchByUser({
      user: fansub,
      term: anime,
      n: number,
      filter: 2
    })

    t.is(data.length, number)
  } catch (e) {
    t.fail()
  }
})

test('SearchByUser method returns a 1000 results if no n is given', async t => {
  try {
    const data = await si.searchByUser({
      user: fansub,
      filter: 2
    })

    t.is(data.length, 1050)
  } catch (e) {
    t.fail(e.message)
  }
})

test('SearchByUser method returns an error is no user is given', async t => {
  try {
    const data = await si.searchByUser()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test(`SearchAllByUser method returns 38 results with 4 arguments`, async t => {
  try {
    const data = await si.searchAllByUser(fansub, anime, {filter: 2})

    t.is(data.length, 38)
  } catch (e) {
    t.fail()
  }
})

test(`SearchAllByUser method returns 38 results with 1 object argument`, async t => {
  try {
    const data = await si.searchAllByUser({
      user: fansub,
      term: anime,
      filter: 2
    })

    t.is(data.length, 38)
  } catch (e) {
    t.fail()
  }
})

test(`SearchAllByUser method returns 1050 results with 1 object argument and no term`, async t => {
  try {
    const data = await si.searchAllByUser(fansub, '')

    t.is(data.length, 1050)
  } catch (e) {
    t.fail()
  }
})

test(`SearchAllByUser method returns an error if no user is given`, async t => {
  try {
    const data = await si.searchAllByUser({
      term: anime,
      filter: 2
    })

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test(`SearchAllByUser method returns an error if no argument is given`, async t => {
  try {
    const data = await si.searchAllByUser()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test('SearchByUserAndByPage method returns 75 results with 1 object argument', async t => {
  try {
    const data = await si.searchByUserAndByPage({
      user: fansub,
      p: 2,
      filter: '2'
    })

    t.is(data.length, 75)
  } catch (e) {
    t.fail()
  }
})

test('SearchByUserAndByPage method returns a 75 results with 4 arguments', async t => {
  try {
    const data = await si.searchByUserAndByPage(fansub, '', 3, null,{
      filter: '2'
    })

    t.is(data.length, 75)
  } catch (e) {
    t.fail()
  }
})

test('SearchByUserAndByPage method returns an error if no term is given', async t => {
  try {
    const data = await si.searchByUserAndByPage()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test('SearchByUserAndByPage method returns an error if no page is given', async t => {
  try {
    const data = await si.searchByUserAndByPage(fansub)

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})