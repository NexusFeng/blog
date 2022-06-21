function foo(el){
  console.log(el)
}

foo.call(123)


Function.prototype.myCall = function(thisArg,...args) {
  var fn = this

  thisArg = thisArg?Object(thisArg):window

  thisArg.fn = fn
  let result = thisArg.fn(...args)

  delete thisArg
  return result
}