// 题目需求
let middleware = []
middleware.push((next) => {
  console.log(1)
  next()
  console.log(1.1)
})
middleware.push((next) => {
  console.log(2)
  next()
  console.log(2.1)
})
middleware.push((next) => {
  console.log(3)
  next()
  console.log(3.1)
})
let fn = compose(middleware)
fn()
/*
1
2
3
3.1
2.1
1.1
*/
//实现compose函数
  function compose(middlewares) {
    if(!Array.isArray(middlewares)) throw new TypeError('middleware must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function') throw new TypeError(`${fn.name} must be a function!`)
    }
    middlewares.reverse()
    return middlewares.reduce((pre,cur)=>{
      return ()=>{
        return cur(pre)
      }
    }, ()=> {})
  }
