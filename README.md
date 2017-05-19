# _Nyaapi_

This is an api allowing one to gather torrents directly from nyaa.si and nyaa.pantsu.cat in about a second or less.

_Nyaapi_ is being developed mainly for [_KawAnime_](https://github.com/Kylart/KawAnime) but anyone can use it for
 its own purpose.

Any contribution is welcomed.

# Use

```javascript
const nyaa = require('nyaapi')
 
const name = '[HorribleSubs] 720p'
 
// To have ull results
nyaa.searchTerm(name).then((data) => {
  console.log(data)
})

// To have only n results
const n = 18

nyaa.searchPantsu(name, n).then((data) => {
  console.log(data)
})
```
```
// One item is structured this way:
{ 
    title: [ '[HorribleSubs] DanMachi Gaiden - Sword Oratoria - 06 [720p].mkv' ],
    updated: [ '2017-05-19T18:21:04Z' ],
    id: [ 'https://nyaa.pantsu.cat/view/924289' ],
    content: [ [Object] ],
    link: [ [Object] ] 
}

```