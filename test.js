// let map = new Map()

map.set('a', 'a')
map.set('b', 'b')
map.set(NaN, 'c')

console.log(NaN == NaN)
console.log(map.get(NaN))

// console.log(map.__proto__.__proto__)
const arr = [ [ 'a', 'a' ], [ 'b', 'b' ] ]
console.log(new Map(arr))

const map = new Map().set('a', 'a').set('b', 'b')

let obj = Object.create(null)
for(let [k,v] of map){
  obj[k] = v
}
console.log(obj)
console.log(map.prototype)

let set = new Set()
set.add([])
set.add([])
console.log(set) // { [], [] }