## promise结构设计
```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  }catch(err) {
    reject(err)
  }
}

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务 
        queueMicrotask(() => {
          if(this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          // 执行then传进来的第一个回调
          this.onFulfilled(this.value)
        })
      }
    }

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if(this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          // 执行then传进来的第二个回调
          this.onRejected
          this.onRejected(this.reason)
        })
      }
    }
    try {
      executor(resolve, reject)
    }catch(err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected){
    // 处理链式调用
    return new myPromise((resolve, reject) => {
      // 如果在then调用时候,状态已经确定(例1)
    if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
      // try {
      //   const value = onFulfilled(this.value)
      //   resolve(value)
      // }catch(err) {
      //   reject(err)
      // }
      execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
    }
    if(this.status === PROMISE_STATUS_REJECTED && onRejected) {
      // try {
      //   const reason = onRejected(this.reason)
      //   // 例2
      //   resolve(reason)
      // }catch(err){
      //   reject(err)
      // }
      execFunctionWithCatchError(onRejected, this.value, resolve, reject)
    }
    // 将成功回调和失败的回调放到数组中
    if(this.status === PROMISE_STATUS_PENDING) {
      this.onFulfilledFns.push(() => {
        // try {
        //   const value = onFulfilled(this.value)
        //   resolve(value)
        // }catch(err) {
        //   reject(err)
        // }
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      })
      this.onRejectedFns.push(() => {
        // try {
        //   const reason = onRejected()
        //   resolve(reason)
        // } catch (err) {
        //   reject(err)
        // }
        execFunctionWithCatchError(onRejected, this.value, resolve, reject)
      })
    }
    })
  }
}


const promise = new myPromise((resolve, reject) => {
  resolve()
  reject()
})
```
例1
```js
const promise = new myPromise((resolve, reject) => {
  console.log('状态pending')
  resolve(111)
  reject(222)
})


// 多次调用then方法
promise.then(res => {
  console.log('res1:', res)
})

setTimeout(() => {
  promise.then(res => {
    console.log('res2:', res)
  })
}, 1000)
```
例2
```js
const promise = new myPromise((resolve, reject) => {
  console.log('状态pending')
  resolve(111)
})

promise.then(res => {
  console.log('res1:', res)
},err => {
  // 此处返回值会进入下一个then方法中(resolve)
  return '1111'
  // 只有抛出错误时才会进入到catch方法中(reject)
  // throw new Error() 
})

promise.then(res => {
  console.log('res', res)
},err => {
  console.log('err', res)
})

```