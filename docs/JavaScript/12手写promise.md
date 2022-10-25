---
title: 12.promise简易实现
---

## promise 结构实现以及相关 api

```js
const PROMISE_STATUS_PENDING = 'pending';
const PROMISE_STATUS_FULFILLED = 'fulfilled';
const PROMISE_STATUS_REJECTED = 'rejected';

// 工具函数
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value);
    resolve(result);
  } catch (err) {
    reject(err);
  }
}

class myPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledFns = [];
    this.onRejectedFns = [];

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        // 添加微任务
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_FULFILLED;
          this.value = value;
          // 执行then传进来的第一个回调
          this.onFulfilled(this.value);
        });
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason;
          // 执行then传进来的第二个回调
          this.onRejected;
          this.onRejected(this.reason);
        });
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const defaultOnRejected = (err) => {
      throw err;
    };
    onRejected = onRejected || defaultOnRejected;

    const defaultOnFulfilled = (err) => {
      throw err;
    };
    onRejected = onFulfilled || defaultOnFulfilled;
    // 处理链式调用
    return new myPromise((resolve, reject) => {
      // 如果在then调用时候,状态已经确定(例1)
      if (this.status === PROMISE_STATUS_FULFILLED) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        execFunctionWithCatchError(onRejected, this.value, resolve, reject);
      }
      // 将成功回调和失败的回调放到数组中
      if (this.status === PROMISE_STATUS_PENDING) {
        this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
        });
        this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.value, resolve, reject);
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    this.then(
      () => {
        onFinally();
      },
      () => {
        onFinally();
      },
    );
  }

  static resolve(value) {
    return new myPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new myPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new myPromise((resolve, reject) => {
      const values = [];
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            values.push(res);
            if (values.length === promises.length) {
              resolve(values);
            }
          },
          (err) => {
            reject(err);
          },
        );
      });
    });
  }

  static allSettled(promises) {
    return new myPromise((resolve) => {
      const results = [];
      promises.forEach(
        (promise) => {
          results.push({ status: PROMISE_STATUS_FULFILLED, value: res });
          if (results.length === promises.length) {
            resolve(results);
          }
        },
        (err) => {
          results.push({ status: PROMISE_STATUS_REJECTED, value: err });
          if (results.length === promises.length) {
            resolve(results);
          }
        },
      );
    });
  }

  static race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject);
      });
    });
  }

  static any(promises) {
    // resolve 必须等到一个有成功的结果
    // reject所有的都失败才执行reject
    const reasons = [];
    return new myPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, (err) => {
          reasons.push(err);
          if (reasons.length === promises.length) {
            reject(new AggregateError(reasons));
          }
        });
      });
    });
  }
}

const promise = new myPromise((resolve, reject) => {
  resolve();
  reject();
});
```

例 1

```js
const promise = new myPromise((resolve, reject) => {
  console.log('状态pending');
  resolve(111);
  reject(222);
});

// 多次调用then方法
promise.then((res) => {
  console.log('res1:', res);
});

setTimeout(() => {
  promise.then((res) => {
    console.log('res2:', res);
  });
}, 1000);
```

例 2

```js
const promise = new myPromise((resolve, reject) => {
  console.log('状态pending');
  resolve(111);
});

promise.then(
  (res) => {
    console.log('res1:', res);
  },
  (err) => {
    // 此处返回值会进入下一个then方法中(resolve)
    return '1111';
    // 只有抛出错误时才会进入到catch方法中(reject)
    // throw new Error()
  },
);

promise.then(
  (res) => {
    console.log('res', res);
  },
  (err) => {
    console.log('err', res);
  },
);
```

## 取消 Promise

`Promise.race()`方法可以用来竞争 Promise,可以借助这个特性,包装一个空的 Promise 与要发起的 Promise 来实现

```js
function wrap(pro) {
  let obj = {};
  let p1 = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  });
  obj.promise = Promise.race([p1, pro]);
  return obj;
}
// 使用
let testPro = newPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  });
});
let warpPro = warp(testPro);
warpPro.promise.then((res) => {
  console.log(res);
});
warpPro.resolve('被拦截了');
```
