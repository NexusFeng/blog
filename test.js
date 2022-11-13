
const arr = [1,[2,[3]]]
function flatten1(arr) {
  const res = []
  const _falt = arr => {
    arr.forEach(item => {
      Array.isArray(item) ? _falt(item) : res.push(item)
    })
  }
  _falt(arr)
  return res
}
console.log(flatten1(arr))

