## promise结构设计
```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if(this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_FULFILLED
        queueMicrotask(() => {
          this.value = value
          // 执行then传进来的第一个回调
          this.onFulfilled(this.value)
        })
      }
    }

    const reject = (reason) => {
      if(this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_REJECTED
        queueMicrotask(() => {
          this.reason = reason
          // 执行then传进来的第二个回调
          this.onRejected
          this.onRejected(this.reason)
        })
      }
    }
    executor(resolve, reject)
  }

  then(onFulfilled, onRejected){
    this.onFulfilledFns.push(onFulfilled)
    this.onRejectedFns.push(onRejected)
  }
}


const promise = new myPromise((resolve, reject) => {
  resolve()
  reject()
})
```