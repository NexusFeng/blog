let map = new Map()
map.set('a',1)
map.set('b',-1)
for(let item of map) {
  console.log(item[1])
}