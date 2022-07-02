let deep = 1
var test = function(i){
  i++
  console.log(i)
  deep = i
  console.log(deep)
}
console.log(test(1))
