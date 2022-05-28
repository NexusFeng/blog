## Ajax Fetch Axios 三者的区别

**三者都是用于网络请求,但是不同维度**

- Ajax 是一种技术统称
- Fetch 是浏览器原生 api,用于网络请求,和 XMLHttpRequest 一个级别,语法更加简洁、易用,支持 Promise

```js
function ajax1(url, successFn) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url, false)
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 20) {
        successFn(xhr.responseText)
      }
    }
  }
  xhr.send(null)
}

function ajax2(url) {
  return fetch(url).then((res) => res.json())
}
```

- axios 是第三请求工具方库，内部可用 XMLHttpRequest 和 Fetch 来实现

## 防抖和节流的区别以及应用场景

- 防抖: 动作绑定事件,动作发生一定时间后触发事件,在这段时间内,如果该动作又发生,则重新等待一定的时间再触发事件,例: 搜索框输入

```js
function debounce(fn, delay) {
  let timer = 0
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```

- 节流:动作绑定事件,动作发生一段时间后触发事件,在这段时间内,如果动作又发生,则无视该动作,直到这段时间后,才重新触发,例如: drag 或 scroll 期间触发某个回调,要设置一个时间间隔

```js
function throttle(fn, delay) {
  let timer = 0
  return function() {
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```

## px % em rem vw vh 有什么区别

- px 基本单位,绝对单位(其他都是相对单位)
- % 相对于**父元素**的宽度比例
- em 相对于**当前元素的 font-size**
- rem 相对于**根节点的 font-size**
- vw 是屏幕宽度的 1%
- vh 是屏幕高度的 1%
- vmin 两者的最小值,vmax 两者的最大值

## 箭头函数

缺点:

- 没有 arguments
- 无法通过 apply call bind 改变 this
- 某些箭头函数代码难以阅读

```js
const fn3 = (a, b) => (b === undefined ? (b) => a * b : a * b)
```

什么时候不能使用箭头函数:

- 对象方法

```js
const obj = {
  name: "feng",
  getName: () => {
    return this.name
  },
}
console.log(obj.getName()) // undefined
```

- 原型方法

```js
const obj = {
  name: "feng",
}
obj.__proto__.getName = () => {
  return this.name
}
console.log(obj.getName()) // undefined
```

- 构造函数

```js
const Foo = (name, age) => {
  this.name = name
  this.age = age
}
const f = new Foo("feng", 18) // Error: Foo is not a constructor
```

- 动态上下文中的回调函数

```js
const btn1 = document.getElementById("btn1")
btn1.addEventListener("click", () => {
  this.innerHtml = "clicked" // this 此时是window
})
```

- vue 生命周期和 methods
  **vue 组件本质上是一个 js 对象**

```js
mounted: () => {
  console.log("msg", this.msg) // Error: Cannot read properties of undefined(reading 'name')
}
```

**React 组件(非 hooks)本质上是一个 ES6 class**

```js
class Foo {
  constructor(name, city) {
    this.name = name
    this.city = city
  }
  getName = () => {
    return this.name
  }
}
const f = new Foo("feng", "nexus")
console.log(f.getName()) // feng
```

## 请描述 TCP 三次握手和四次挥手

**建立 TCP 连接**

- 先建立连接(确保双方都有收发消息的能力)
- 再传输内容(如发送一个 get 请求)
- 网络连接是 tcp 协议,传输内容是 HTTP 协议

**为什么是三次握手?**

- Client 发包,Server 接收。Server: 有 Client 要找我
- Server 发包,Client 接收。Client: Server 已经收到消息了
- Client 发包,Server 接收。Server: Client 要准备发送了

**四次挥手: 关闭连接**

- Client 发包,Server 接收。Server: Client 已请求结束
- Server 发包,Client 接收。Client: Server 已收到,等待她关闭
- Server 发包,Client 接收。Client: Server 此时可以关闭连接了
- Client 发包,Server 接收。Server: 可以关闭了(然后关闭连接)

## for...in 和 for...of 区别

- for...in 遍历得到 key
- for...of 遍历得到 value
- 遍历对象: for...in 可以,for...of 不可以
- 遍历 Map Set: for...of 可以,for...in 不可以
- 遍历 generator: for...of 可以,for...in 不可以
  **for...in 用于*可枚举*数据,如对象、数组、字符串,得到 key**  
  **for...of 用于*可迭代*数据,如字符串、数组、Map、Set,得到 value**

## for await ...of 有什么作用?

- for await...of 用于遍历多个 promise

```js
function createPromise(val) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val)
    }, 1000)
  })
}

const p1 = createPromise(100)
const p2 = createPromise(200)
const p3 = createPromise(300)

const list = [p1, p2, p3]
// Promise.all(list).then((res) => console.log(res))
for await (let res of list) {
  console.log(res)
}

const arr = [10, 20, 30]
for (let num of arr) {
  const res = await createPromise(num)
  console.log(res) // 一秒一秒输出数字
}
```
