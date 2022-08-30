
function compose(...funcs){
  //没有放函数，那就返回传入参数
  if(funcs.length === 0)return (num)=>num
  //函数组合长度为1，返回函数
  if(funcs.length === 1)return funcs[0]
  //其余情况，对funcs进行reduce，里面的函数会从左往右执行，
  //第一个函数执行完返回的结果将会传递到下一个函数中作为参数继续执行
  
  //总体会返回一个方法，用法：compose(函数组合)(传入参数num)
  return funcs.reduce((pre,cur)=>{
    //返回一个函数作为下一个pre，函数内执行cur(pre(num)),
    return (num)=>{
      //pre(num)是函数组合内上一个函数执行,
      //cur(pre(num))指的是当前函数执行
      //返回cur(pre(num))作为新的参数给下个函数继续执行
      return cur(pre(num))
    }
  })
}
function fn1(x){
  return x + 1
}
function fn2(x){
  return x + 2
}
function fn3(x){
  return x + 3
}
function fn4(x){
  return x + 4
}
const a = compose(fn1,fn2,fn3,fn4)
console.log(a(1))// 11 相当于fn1(fn2(fn3(fn4(1))))