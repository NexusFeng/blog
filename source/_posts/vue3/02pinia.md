---
title: Pinia
date: 2021-04-13
categories: 
  - Vue3
tags: 
  - Vue3
  - 学习笔记
---

## 创建 Store

形式一

```ts
// src/stores/index.ts
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  // store 选项
});
```

形式二

```ts
import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'main',
  // Store 选项
});
```

**必须为 Store 指定一个唯一 ID**

## 管理 state

```ts
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello',
    // pinia会推导ts类型,但有时不够用,此处会推到为never[],可以通过自己定义messageArr: [] as string[] 或者 messageArr: <string[]>[]
    messageArr: [],
  }),
});
```

**state 的类型必须是`state?:(() => {}) | undefined`,要么不配置,要么是`undefined`**

### 获取和更新 state

**不能通过结构方式获取 state(`const { message } = store`),这样会破坏响应性**  
1.使用 store 实例获取 state

```ts
import { useStore } from '@/stores';

const store = useStore();
// 获取
console.log(store.message);
// 更新
store.message = 'new hello';
```

2.使用 computed API

```ts
import { computed } from 'vue';
import { useStore } from '@/stores';

const message = computed(() => store.message);
console.log(message.value);
```

**只读,这里的 message 只有 getter,没有 setter**  
改写:

```ts
import { computed } from 'vue';
import { useStore } from '@/stores';

const message = computed({
  get: () => store.message,
  set(newVal) {
    store.message = newVal;
  },
});
console.log(message.value);
message.value = 'new message';
```

3.使用`storeToRefs` API  
pinia 提供`storeToRefs` API 用于把 state 数据转换为`ref`变量

```ts
import { useStore } from '@/store';
import { storeToRefs } from 'pinia';

const store = useStore();
const { message } = storeToRefs(store);
console.log(message.value);
message.value = 'new message';
```

4.使用`toRefs` API

```ts
import { toRefs } from 'vue';
import { useStore } from '@/store';

const store = useStore();
const { message } = toRefs(store);
console.log(message.value);
message.value = 'new message';
```

5.使用`toRef` API  
`toRef`和`toRefs`一个是只转换一个字段,一个是转换所有字段

```ts
import { toRef } from 'vue';
import { useStore } from '@/store';

const store = useStore();
const { message } = toRef(store, 'message');
console.log(message.value);
message.value = 'new message';
```

### 批量更新 state

1.传入一个对象

```ts
import { useStore } from '@/store';

const store = useStore();
store.$patch({
  message: 'new Val',
  messageArr: ['msg1', 'msg2'],
});
// 全量更新写法
store.$state = {
  message: 'new Val',
  messageArr: ['msg1', 'msg2'],
};
// 重置state
store.$reset();
```

2.传入一个函数

```ts
import { useStore } from '@/store';

const store = useStore();
store.$patch((state) => {
  state.message = 'new Val';
  for (let i = 0; i < 3; i++) {
    state.messageArr.push(i);
  }
});
```

### 订阅 state

订阅 api 的 ts 类型定义

```ts
$subscribe(
  callback: SubscriptionCallback<S>,
  options?: {detached?: boolean} & WatchOptions
): () => void
```

两个参数: 1.callback 函数(必传),2.选项(可选)

添加订阅  
`$subscribe`API 功能类似于 watch, 但它只会在 state 被更新的时候才触发一次,并且组件卸载时删除

```ts
// mutation表示本次事件的一些信息,例如storeId pinia实例唯一ID,type:dript(直接更改数据)、patch object(通过传入一个对象更改)、patch function（通过一个函数更改）
store.$subscribe(
  (mutation, state) => {
    localStore.setItem('store', JSON.stringify(state));
  },
  { detached: true },
); // 组件卸载时不删除订阅
```

移除订阅

```ts
const unsubscribe = store.$subscribe(
  (mutation, state) => {
    localStore.setItem('store', JSON.stringify(state));
  },
  { detached: true },
);

// 取消订阅
unsubscribe();
```

## 管理 getters

### 给 store 添加 getter

添加普通 getter

```ts
// src/stores/index.ts
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello',
  }),
  getters: {
    fullMessage: (state) => `this is${state.message}'`,
  },
});
```

给 getter 传递参数

```ts
// src/stores/index.ts
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello',
  }),
  getters: {
    singedMessage: (state) => {
      return (name: string) => `${name} say ${message}`;
    },
  },
});
// 使用
const signedMessage = store.signedMessage('nexus');
console.log(signedMessage); // nexus say hello
```

这种情况下,这个 getter 只是调用的函数的作用,不再具有缓存,如果通过变量定义了这个数据,那么这个变量也只是普通变量,不具备响应性

```ts
const signedMessage = store.signedMessage('nexus');
console.log(signedMessage); // nexus say hello

setTimeout(() => {
  store.message = 'new Val';
  // signedMessage不会变
  console.log(signedMessage); // nexus say hello
  // 必须再次执行才能拿到更新后的值
  console.log(signedMessage, store.signedMessage('nexus')); // nexus say new Val
}, 2000);
```

## 管理 actions

### 添加 action

```ts
// src/stores/index.ts
import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
  state: () => ({
    message: 'hello',
  }),
  actions: {
    // 异步
    async updateMessage(newVal: string): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => {
          // this是当前Store实例
          this.message = newVal;
          resolve('over');
        }, 3000);
      });
    },
    // 同步
    updateMessageSync(newVal: string): string {
      this.message = newVal;
      return 'over';
    },
  },
});
```

### 调用 action

不需要像 vuex 一样执行 commit 或者 dispatch

```ts
import { useStore } from '@/store';

const store = useStore();
const { message } = storeToRefs(store);

// 立即执行
store.updateMessageSync('new Val');
// 异步执行
store.updateMessage('new Val').then((res) => console.log(res));
```

### 添加多个 Store

### 目录结构

```
src
  stores
   index.ts 入口
   多个 store
   user.ts
   game.ts
   news.ts
```

**暴露的方法统一以`use`开头加上文件名,并以`Store`作为结尾,并且每个 Store 实例的 ID 必须不同**

### Store 之间的相互引用

```ts
// src/stores/message.ts
import { defineStore } from 'pinia';

// 导入别的store
import { useUserStore } from './user';
const userStore = useUserStore();
export const useMessageStore = defineStore('message', {
  state: () => ({
    message: 'hello',
  }),
  getters: {
    greeting: () => `say ${userStore.userName}`,
  },
});
```

## 使用插件

例: `pinia-plugin-persistedstate`数据持久化插件

```ts
// src/main.ts
import { createApp } from 'vue';
import App from '@/App.vue';
import { createPinia } from 'pinia'; // 导入pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // 导入pinia插件

const pinia = createPinia(); // 初始化pinia
pinia.use(piniaPluginPersistedstate); // 激活pinia插件

createApp(App)
  .use(pinia) // 启用pinia，这一次包含了插件的pinia实例
  .mount('#app');
```
