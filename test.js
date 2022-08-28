function myInstanceof(left, right) {
  if (!right) return false
  right = right.prototype
  while(left){
    if (left === right) return true
    left = Object.getPrototypeOf(left)
  }
  return false
}
let arr = [1,2,3]
console.log(myInstanceof(null, ))