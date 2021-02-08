require('colors')
const test = require('ava')

const {pantsu} = require('../src/index.js')

const fansub = '[HorribleSubs]'
const quality = '720p'
const anime = 'Youjo senki'
const number = 18

test.before('[Pantsu] methods', () => {
  console.log('[Pantsu] methods:'.green)
  Object.keys(pantsu).forEach((key) => {
    console.log(`    > ${key}`.yellow)
  })
})

test('Search method gives 18 results with 3 arguments', async t => {
  try {
    const data = await pantsu.search(fansub, number, {order: true})

    t.is(data.length, number)
  } catch (e) {
    t.fail(e.message)
  }
})

test('Search method gives results with 1 object argument', async t => {
  try {
    const data = await pantsu.search({
      term: fansub,
      n: 52,
      order: true
    })

    t.is(data.length, 52)
  } catch (e) {
    t.fail(e.message)
  }
})

test('Search method return an error if no term is given', async t => {
  try {
    const data = await pantsu.search()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test('Search method return an error if no term is given in object arg', async t => {
  try {
    const data = await pantsu.search({})

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})


test('SearchAll method gives 900 results with 3 arguments', async t => {
  try {
    const data = await pantsu.searchAll(fansub, {sort: true})

    t.is(data.length, 900)
  } catch (e) {
    t.fail(e.message)
  }
})

test('SearchAll method gives 900 results with 2 arguments', async t => {
  try {
    const data = await pantsu.searchAll({
      term: fansub,
      sort: true 
    })

    t.is(data.length, 900)
  } catch (e) {
    t.fail(e.message)
  }
})

test('SearchAll method return an error if no term is given', async t => {
  try {
    const data = await pantsu.searchAll()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test('SearchAll method return an error if no term is given in object arg', async t => {
  try {
    const data = await pantsu.searchAll({})

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))
  }
})

test('InfoRequest method gives right info', async t => {
  try {
    const data = await pantsu.infoRequest(510619)

    t.is(data.name, '[HorribleSubs] Sakura Trick - 01 [1080p].mkv')
    t.is(data.hash, 'DAD8DB31EB1DAD06E651621818AF427C4F1D04FE')
  } catch (e) {
    t.fail(e.message)
  }
})

test('InfoRequest method returns an error if no ID is given', async t => {
  try {
    const data = await pantsu.infoRequest()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})

test('CheckUser method gives right info', async t => {
  try {
    const data = await pantsu.checkUser(12035)

    t.is(data.ok, true)
    t.is(data.data.username, 'HorribleSubs')
    t.is(data.data.created_at, '2017-07-02T14:52:25Z')
  } catch (e) {
    t.fail(e.message)
  }
})

test('Checkuser method returns an error if no ID is given', async t => {
  try {
    const data = await pantsu.checkUser()

    t.fail()
  } catch (e) {
    t.true(e.message.includes('[Nyaapi]'))    
  }
})