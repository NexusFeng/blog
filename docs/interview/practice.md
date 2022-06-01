## Ajax Fetch Axios 三者的区别

**三者都是用于网络请求,但是不同维度**

- Ajax 是一种技术统称
- Fetch 是浏览器原生 api,用于网络请求,和 XMLHttpRequest 一个级别,语法更加简洁、易用,支持 Promise

```js
function ajax1(url, successFn) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, false)
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
  name: 'feng',
  getName: () => {
    return this.name
  },
}
console.log(obj.getName()) // undefined
```

- 原型方法

```js
const obj = {
  name: 'feng',
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
const f = new Foo('feng', 18) // Error: Foo is not a constructor
```

- 动态上下文中的回调函数

```js
const btn1 = document.getElementById('btn1')
btn1.addEventListener('click', () => {
  this.innerHtml = 'clicked' // this 此时是window
})
```

- vue 生命周期和 methods
  **vue 组件本质上是一个 js 对象**

```js
mounted: () => {
  console.log('msg', this.msg) // Error: Cannot read properties of undefined(reading 'name')
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
const f = new Foo('feng', 'nexus')
console.log(f.getName()) // feng
```

## 请描述 TCP 三次握手和四次挥手

**建立 TCP 连接**

- 先建立连接(确保双方都有收发消息的能力)
- 再传输内容(如发送一个 get 请求)
- 网络连接是 tcp 协议,传输内容是 HTTP 协议

**为什么是三次握手?**

- 保持序列号同步,三次不能保证序列号一样
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

## offsetHeight、scrollHeight、clientHeight 区别

- offsetHeight offsetWidth: **border + padding + content**
- clientHeight clientWidth: **padding + content**
- scrollHeight scrollWidth: **padding + 实际内容尺寸**

## HTMLCollection 和 NodeList 区别

**Node 和 Element**

- DOM 是一棵树,所有节点都是 Node
- Node 是 Element 的基类
- Element 是其他 HTML 元素的基类,如 HTMLDivElement

**HTMLCollection 和 NodeList**

- **两者都不是数组,而是类数组**
- HTMLCollection 是 Element 的集合
- NodeList 是 Node 的集合
  **获取 Node 和 Element 的返回的结果可能不一样,如: elem.childNodes 和 elem.children 不一样,前者会包含 Text 和 Comment 节点,后者不会**

## vue computed 和 watch 的区别

- computed 用于计算产生新的数据
- watch 用于监听现有数据

## Vue 组件的通讯方式

- props 和`$emit`
- 自定义事件(bus)

```js
// vue2new vue即可,vue3得引入第三方库
let bus = new vue()

// 接收
bus.on('add', this.add)
//关闭
bus.off('add', this.add)

// 发送
bus.emit('add', 'hello')
```

- `$attrs $listeners`,vue3 移除了`$listeners`

- `$parent $children`,vue3 移除了`$children`
- `$refs`
- provide/inject
- Vuex

不同场景

- 父子组件
- 上下级组件(跨多级)通讯
- 全局组件

## vuex mutation action 区别

- mutation:原子操作；必须包含同步代码
- action: 可包含多个 mutation；可包含异步代码

## js 严格模式有什么特点

- 全局变量必须先声明
- 禁止使用 with
- 创建 eval 作用域
- 禁止 this 指向 window
- 函数参数不能重名

## HTTP 跨域时为何要发送 options 请求

- options 请求,是跨域请求之前的预检查
- **浏览器自行发起的**,无需我们干预
- 不影响实际功能

**跨域请求**

- 浏览器同源策略
- 同源策略一般限制 Ajax 网络请求,不能跨域请求 server
- 不会限制`<link><img><script><iframe>`加载第三方资源

**JSONP 解决跨域**

```js
// www.a.com
<script>
window.onSuccess = function(data){
  console.log(data)
}
</script>
<script scr = 'https://www.b.com'>
// https://www.b.com返回一段字符串: 'onSuccess({error: 0, data: {}})'
```

**CORS 解决跨域**

```js
// CORS配置允许跨域(服务端)
response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081') //或者"*"
response.setHeader('Access-Control-Allow-Headers', 'X-Requested-with')
response.setHeader(
  'Access-Control-Allow-Methods',
  'PUT,POST,GET,DELETE,OPTIONS'
)
response.setHeader('Access-Control-Allow-Credentials', 'true') //允许跨域接收cookie
```

token 需要手动加,cookie 浏览器会自带,

## js 内存泄漏如何检测?场景有哪些?

performance，memory 一直在上升,锯齿状最佳

场景

- 被全局变量、函数引用,组件销毁时未清除
- 被全局事件、定时器引用,组件销毁时未清除
- 被自定义事件引用,组件销毁时未清除

  垃圾回收算法

- 引用计数(有循环引用问题)
- 标记清除(目前方式)

**WeakMap、WeakSet 弱引用**

- WeakMap 的 key 只能是引用类型,因为值类型会直接被回收,没法用 size、forEach,内部元素不稳定

## nodejs 和浏览器的事件循环有什么区别

**浏览器事件循环: 宏任务和微任务**

- 宏任务,如 setTimeout setInterval 网络请求 ajax
- 微任务,如 promise async/await,页面渲染之前触发
- 微任务在下一轮 DOM 渲染之前执行,宏任务在之后执行

**nodejs 异步**

- Nodejs 同样使用 ES 语法,也是单线程,也需要异步
- 异步任务也分: 宏任务 + 微任务
- 宏任务和微任务,**分不同类型,有不同优先级**

- 执行同步代码
- 执行微任务
- 按顺序执行 6 个类型的宏任务(每个开始之前都执行当前的微任务)

**宏任务优先级**

- Timers - setTimeout setInterval
- I/O callbacks - 处理网络、流、TCP 的错误回调
- idle,prepare - 闲置状态(nodejs 内部使用)
- Poll 轮询 - 执行 poll 中的 I/O 队列
- Check 检查 - 储存 setImmediate 回调
- Close callbacks - 关闭回调,如 socket.on('close')

**微任务优先级**

- promise,async/await,process.nextTick
- **process.nextTick 优先级最高**

```js
console.info('start')
setImmediate(() => {
  console.info('setImmediate')
})
setTimeout(() => {
  console.info(timeout)
})
Promise.resolve().then(() => {
  console.info('promise then')
})
process.nextTick(() => {
  console.info('nextTick')
})
console.info('end')
// start
// end
// nextTick
// promise then
// timeout
// setImmediate
```

## vdom 很快吗

- vdom 并不快,JS 直接操作 DOM 才是最快的
- 但'数据驱动视图'要有合适的技术方案,不能全部 DOM 重建
- vdom 就是目前最合适的技术方案(并不是因为他快,而是合适)

## 遍历数组,for 和 forEach 那个快

- for 更快
- forEach 每次都要创建一个函数来调用,而 for 不会创建函数
- 函数需要独立作用域,会有额外的开销

```js
const arr = []
for (let i = 0; i < 100 * 10000; i++) {
  arr.push(i)
}
const length = arr.length

console.time('for')
let n1 = 0
for (let i = 0; i < length; i++) {
  n1++
}
console.timeEnd('for') //3.7ms

console.time('forEach')
let n2 = 0
arr.forEach(() => n2++)
console.timeEnd('forEach') // 15.1ms
```

## 描述 js-bridge 的实现原理

**概念**

- js 无法直接调用 native API(手机 app)
- 需要通过一些特定的'格式'来调用
- 这些'格式'就统称为 JS-Bridge,例如微信 JSSDK

**常见实现方式**

- 注册全局 api
- URL Scheme(自造一种协议标准,在 app 层做拦截)

## RAF 和 RIC 区别

- requestAnimationFrame 每次渲染完都会执行,**高优**
- requestIdleCallback 空闲时才执行,**低优**
- **两者都是宏任务,因为都要等 DOM 渲染完才执行,肯定是宏任务**

## vue 什么时候操作 DOM 比较合适

- mounted 和 updated 都不能保证子组件全部挂载完成
- 使用`$nextTick` 渲染 DOM

## vue2 vue3 React 三者 diff 算法有何区别

tree diff 优化,优化后时间复杂度为 O(n),之前为 O(n^3)

- 只比较同一层级,不跨级比较
- tag 不同则删掉重建(不再去比较内部细节)
- 子节点通过 key 区分(key 的重要性)

- React diff 仅右移
- Vue2 双端比较
- Vue3 最长递增子序列

## vue-router MemoryHistory

vue-router 三种模式

- Hash
- WebHistory
- MemoryHistory(v4 之前叫 abstract history)
  路由不能前进和后退,地址栏不会展示子组件的路由
