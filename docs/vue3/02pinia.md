---
title: 2.Pinia
---
## 创建Store
形式一
```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  // store 选项
})
```
形式二
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'main',
  // Store 选项
})
```
**必须为Store指定一个唯一ID**
## 管理state
```ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello',
    // pinia会推导ts类型,但有时不够用,此处会推到为never[],可以通过自己定义messageArr: [] as string[] 或者 messageArr: <string[]>[]
    messageArr: []
  })
})
```
**state的类型必须是`state?:(() => {}) | undefined`,要么不配置,要么是`undefined`**
### 获取和更新state
**不能通过结构方式获取state(`const { message } = store`),这样会破坏响应性**  
1.使用store实例获取state
```ts
import { useStore } from '@/stores'

const store = useStore()
// 获取
console.log(store.message)
// 更新
store.message = 'new hello'
```
2.使用computed API
```ts
import { computed } from 'vue'
import { useStore } from '@/stores'

const message = computed(() => store.message)
console.log(message.value)
```
**只读,这里的message只有getter,没有setter**  
改写:
```ts
import { computed } from 'vue'
import { useStore } from '@/stores'

const message = computed({
  get:() => store.message,
  set(newVal){
    store.message = newVal
  }
})
console.log(message.value)
message.value = 'new message'
```
3.使用`storeToRefs` API  
pinia提供`storeToRefs` API用于把state数据转换为`ref`变量
```ts
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { message } = storeToRefs(store)
console.log(message.value)
message.value = 'new message'
``` 
4.使用`toRefs` API  
```ts
import { toRefs } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const { message } = toRefs(store)
console.log(message.value)
message.value = 'new message'
``` 
5.使用`toRef` API      
`toRef`和`toRefs`一个是只转换一个字段,一个是转换所有字段
```ts
import { toRef } from 'vue'
import { useStore } from '@/store'

const store = useStore()
const { message } = toRef(store, 'message')
console.log(message.value)
message.value = 'new message'
``` 
### 批量更新state  
1.传入一个对象
```ts
import { useStore } from '@/store'

const store = useStore()
store.$patch({
  message: 'new Val',
  messageArr: ['msg1', 'msg2']
})
// 全量更新写法
store.$state = {
  message: 'new Val',
  messageArr: ['msg1', 'msg2']
}
// 重置state
store.$reset()
```
2.传入一个函数
```ts
import { useStore } from '@/store'

const store = useStore()
store.$patch(state => {
  state.message = 'new Val'
  for(let i = 0; i < 3; i++) {
    state.messageArr.push(i)
  }
})
```
### 订阅state
订阅api的ts类型定义
```ts
$subscribe(
  callback: SubscriptionCallback<S>,
  options?: {detached?: boolean} & WatchOptions
): () => void
```
两个参数: 1.callback函数(必传),2.选项(可选)  

添加订阅  
`$subscribe`API功能类似于watch, 但它只会在state被更新的时候才触发一次,并且组件卸载时删除
```ts
// mutation表示本次事件的一些信息,例如storeId pinia实例唯一ID,type:dript(直接更改数据)、patch object(通过传入一个对象更改)、patch function（通过一个函数更改）
store.$subscribe((mutation, state) => {
  localStore.setItem('store', JSON.stringify(state))
}, {detached: true})// 组件卸载时不删除订阅
```

移除订阅
```ts
const unsubscribe = store.$subscribe((mutation, state) => {
  localStore.setItem('store', JSON.stringify(state))
}, {detached: true})

// 取消订阅
unsubscribe()
```
## 管理getters
### 给store添加getter
添加普通getter
```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello'
  }),
  getters: {
    fullMessage: state => `this is${state.message}'`
  }
})
```
给getter传递参数
```ts
// src/stores/index.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello'
  }),
  getters: {
    singedMessage: state => {
      return (name: string) => `${name} say ${message}`
    }
  }
})
// 使用
const signedMessage = store.signedMessage('nexus')
console.log(signedMessage)// nexus say hello
```
这种情况下,这个getter只是调用的函数的作用,不再具有缓存,如果通过变量定义了这个数据,那么这个变量也只是普通变量,不具备响应性
```ts
const signedMessage = store.signedMessage('nexus')
console.log(signedMessage)// nexus say hello

setTimeout(() => {
  store.message = 'new Val'
  // signedMessage不会变
  console.log(signedMessage)// nexus say hello
  // 必须再次执行才能拿到更新后的值
  console.log(signedMessage, store.signedMessage('nexus'))// nexus say new Val
}, 2000)
```