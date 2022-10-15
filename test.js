let arr = [1,2,[3,[4]]]
function flatten(arr) {
  if(!arr.length) return
  return arr.reduce((pre,cur) => 
    { return Array.isArray(cur)? [...pre, ...flatten(cur)]: [...pre, cur]},[]
  )
}
console.log(flatten(arr))