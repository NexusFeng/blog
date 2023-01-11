
const F = function () {}
Object.prototype.a = function () {
  console.log('a')
}

Function.prototype.b = function () {
  console.log('b')
}

const f = new F()

f.a() // a
f.b() // b
