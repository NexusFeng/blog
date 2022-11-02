Array.prototype._reduce = function(fn, base){
  if(typeof fn !== 'function') throw new Error('参数必须是函数')
  if(!Array.isArray(this)) throw new Error('只有数组才能使用reduce方法') 
  let arr = this
  if(base){
    i = 0
  } else {
    base = arr[0]
    i = 1
  }
  for(i; i < arr.length; i++) {
    base = fn(base, arr[i], i, arr)
  }
  return base
}
const array1 = [2, 3, 4]
const map1 = array1._reduce((pre, cur) => {
  return pre + cur
})
console.log(map1)
// expected output: "a"
// expected output: "b"
// expected output: "c"

