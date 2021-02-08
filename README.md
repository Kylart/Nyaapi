<h1 align="center">Nyaapi 2.0</h1>

<p align="center">
  <a href="http://forthebadge.com/" target="_blank">
    <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://standardjs.com/" target="_blank">
    <img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" />
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/Kylart/Nyaapi" target="_blank">
    <img src="https://travis-ci.org/Kylart/Nyaapi.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/Kylart/Nyaapi" target="_blank">
    <img src="https://codecov.io/gh/Kylart/Nyaapi/branch/master/graph/badge.svg" alt="Codecov" />
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
</p>

This is an api allowing one to:
* gather torrents directly from [nyaa.si](https://nyaa.si) and [nyaa.pantsu.cat](https://nyaa.pantsu.cat) in about a second or less.
* upload a torrent to any nyaa.
* check a user's profile and torrents.
* So many things you should check the wiki to understand better.

__All the documentation there is to know about how to use Nyaapi is located in the [wiki](https://github.com/Kylart/Nyaapi/wiki).__

Any contribution is welcomed.

# Install
```
npm install --save nyaapi
```

# Use
Nyaapi is organised with `si` methods and `pantsu` methods.
You can access either of them like so:
```javascript
const {si, pantsu} = require('nyaapi')

console.log(si)
/**
 * [Si] methods:
 *   > list
 *   > search
 *   > searchAll
 *   > searchPage
 *   > searchByUser
 *   > searchAllByUser
 *   > searchByUserAndByPage
 *   > infoRequest
 *   > upload
 * 
 */
console.log(pantsu)
/**
 * [Pantsu] methods:
 *   > list
 *   > search
 *   > searchAll
 *   > infoRequest
 *   > upload
 *   > update
 *   > login
 *   > checkUser
 *   > checkHeader
 * 
 */
```

# Configuration
For both `si` and `pantsu` you can update the base URL for the calls this way:
```javascript
const { si, pantsu } = require('nyaapi')

si.config.updateBaseUrl('https://nyaa.whatever')
pantsu.config.updateBaseUrl('https://nyaa.whatever')
```

It is important to know that all the pantsu methods are fully based on [the offcial api of nyaa.pantsu.cat](https://nyaa.pantsu.cat/apidoc).

> For a complete documentation, please check out the [wiki](https://github.com/Kylart/Nyaapi/wiki) for a tour of all the methods and how to use them.