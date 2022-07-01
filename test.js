var test = (function() {
  var num = 0
  return () => {
    return num++
  }
}())
for(let i = 0; i < 10; i++) {
  test()
}
console.log(test())
