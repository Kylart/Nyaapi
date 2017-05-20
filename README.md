# _Nyaapi_  [![Build Status](https://travis-ci.org/Kylart/Nyaapi.svg?branch=master)](https://travis-ci.org/Kylart/Nyaapi)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is an api allowing one to gather torrents directly from nyaa.si and nyaa.pantsu.cat in about a second or less.

_Nyaapi_ is being developed mainly for [_KawAnime_](https://github.com/Kylart/KawAnime) but anyone can use it for
 its own purpose.

Any contribution is welcomed.

# Use

```javascript
const nyaa = require('nyaapi')
 
const term = '[HorribleSubs] 720p'
 
// To have all results
nyaa.searchPantsu(term).then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err.message)
})
 
// OR
 
nyaa.searchSi(term).then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err.message)
})
 
// To have only n results
const n = 18
 
nyaa.searchPantsu(term, n).then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err.message)
})
 
// OR
 
nyaa.searchSi(term, n).then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err.message)
})
```

```
// One item will be structure this way
// For nyaa.si (searchSi)

{ 
    title: [ '[HorribleSubs] Detective Conan - 860 [720p].mkv' ],
    link: [ 'https://nyaa.si/view/924806/torrent' ],
    guid: [ [Object] ],
    pubDate: [ 'Sat, 20 May 2017 11:35:23 -0000' ],
    seeders: [ '94' ],
    leechers: [ '47' ],
    downloads: [ '100' ],
    infoHash: [ 'c7fae015f2ee9f134cd30783e5f4af4d3a1006a1' ],
    categoryId: [ '1_2' ],
    category: [ 'Anime - English-translated' ],
    size: [ '335.5 MiB' ]
}
 
// For nyaa.pantsu.cat (searchPantsu)
{ 
    title: [ '[HorribleSubs] Detective Conan - 860 [720p].mkv' ],
    link: [ 'magnet:?xt=urn:btih:C7FAE015F2EE9F134CD30783E5F4AF4D3A1006A1&dn=[HorribleSubs] Detective Conan - 860 [720p].mkv&tr=udp://tracker.doko.moe:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://zer0day.to:1337/announce&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://explodie.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=udp://tracker.internetwarriors.net:1337/announce&tr=http://mgtracker.org:6969/announce&tr=http://tracker.baka-sub.cf/announce' ],
    description: [ '<h1>[HorribleSubs] Detective Conan - 860 [720p].mkv</h1>\n' ],
    guid: [ 'https://nyaa.pantsu.cat/view/924369' ],
    pubDate: [ 'Sat, 20 May 2017 11:36:04 +0000' ] 
}
```