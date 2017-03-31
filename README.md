# _Nyaapi_

This is an api allowing one to gather torrents directly from nyaa.se in around half a second.

_Nyaapi_ is being developed mainly for [_KawAnime_](https://github.com/Kylart/KawAnime) but anyone can use it for
 its own purpose.

Any contribution is welcomed.

# Use

```javascript
const nyaa = require('nyaapi')
 
const name = '[HorribleSubs] 720p'
 
// To have ull results
nyaa.searchTerm(name).then((result) => {
  console.log(result.items)
  console.log(result.statMsg)
})

// To have only n results
const n = 18

nyaa.searchTerm(name, n).then((result) => {
  console.log(result.items)
  console.log(result.statMsg)
})
```
```
// One item is structured this way:
{ 
  title: [ '[HorribleSubs] Kuzu no Honkai - 12 [720p].mkv' ],
  category: [ 'Anime - English-translated' ],
  link: [ 'https://www.nyaa.se/?page=download&tid=912681' ],
  guid: [ 'https://www.nyaa.se/?page=view&tid=912681' ],
  description: [ '1265 seeder(s), 100 leecher(s), 11010 download(s) - 277.6 MiB - Trusted' ],
  pubDate: [ 'Thu, 30 Mar 2017 20:23:33 +0000' ] 
}

```