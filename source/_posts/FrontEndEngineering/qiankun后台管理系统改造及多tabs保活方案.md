---
title: qiankun后台管理系统改造及多tabs保活方案
date: 2023-05-26
categories: 
  - 工程化
tags: 
  - 工程化
---

## 前言

> 由于我们项目是vue技术栈,所以本文实现也是基于vue技术栈的demo

在大多数后台管理系统中，用户需要同时打开多个标签页来处理不同的任务，例如查看数据、编辑内容或者进行多任务处理。然而，当用户在一个标签页上进行了操作，切换到另一个标签页时，原来标签页的状态会丢失或者重新加载，给用户的体验带来了不便。在使用qiankun的情况下，主/应用本身可以利用`keep-alive`来做页面保活，但是从主应用页签切换到子应用页签的时候就出现了失效。

解决此问题，我们可以参考vue的`keep-alive`实现原理，在主/子应用切换的时候，将子应用`vnode`缓存下来，下次加载时先检查缓存，有缓存则优先使用缓存进行渲染。

那么，先从改造开始吧！

🎊最终效果如下:

![Video\_23-05-26\_12-33-28.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b713c81512684fe0855270f882f57055~tplv-k3u1fbpfcp-watermark.image?)

🖥demo仓库地址:👉[qiankun-tabsCache](https://github.com/NexusFeng/qiankun-tabsCache)

## 改造

系统整体分为主应用和子应用,主应用也就是基座(demo中为main)主要为系统的公共部分,比如我们后台管理系统中的顶部和左侧菜单栏。子应用(demo中为mirco1)主要是各自的业务系统

> 按照[qiankun官网](https://qiankun.umijs.org/zh/guide/tutorial)步骤就可以搭建出来，这里不做详细步骤,讲一些关键点

![无标题-2022-08-31-2228.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8f357f8d30f4e7baaa7d19e471964ee~tplv-k3u1fbpfcp-watermark.image?)

### 主应用

先将子应用注册一下:  **如果采用hash模式,配置的activeRule别忘了加#**

```js
// src/config/register.js
export const microAppConfig = [
  {
    id: 'micro1',
    name: 'micro1',
    entry:'//localhost:1801',
    container: '#micro1',
    activeRule: '#/micro1',
    props: {
      name: 'micro1'
    }
  }
]

// src/main.js
import { registerMicroApps, start } from 'qiankun'
import { microAppConfig } from '@/config/register'

registerMicroApps(microAppConfig)
start()
```

将主应用的containter改造一下，如果当前路由是子应用路由，那就使用`div`直接渲染，如果不是则使用`keep-alive`，判断路由可以写一个监听来做

```html
<!-- src/page/index.vue -->
<template>
  <el-container>
  <el-header></el-header>
  <el-container>
    <el-aside width="300px">
      <el-menu></el-menu>
    </el-aside>
    <el-main>
      <tags></tags>
      <div v-show="!isMicroApp">
        <keep-alive :include="keepAliveList">
          <router-view v-slot="{ Component }">
            <component  :is="Component" />
          </router-view>
        </keep-alive>
      </div>
       <div v-show="isMicroApp">
        <div
          :id="item.id"
          v-for="item in microAppConfig"
          :key="item.id"
          v-show="isMicroApp"
        ></div>
      </div>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
...
export default {
  ...
  watch: {
    '$route.path': {
      handler: function(val){
        this.isMicroApp = isMicroApp(val)
      }, 
    }
  },
 ...
};
</script>
```

要保证左侧导航栏的子应用模块能准确跳转，我们还需要将**需要的**子应用的路由在主应用的路由里注册一下:**我们只需要子应用的路由，component不是我们需要的**

```js
export const routes = [
  {
    path: '/micro1',
    name: 'micro1',
    children: [
      {
        path: 'form',
        name: 'Form',
        meta:{
          keepalive: true,
          title: '子-表单'
        },
        // component: () => import("@/views/form.vue")
      },
       ...
    ]
  }, 
  {
    path: '/main',
    name: 'Home',
    component: Layout,
    redirect: '/main/home',
    children: [
      ...主应用路由
    ]
  }
]

const router = new VueRouter({
  routes
 })
```

### 子应用

在后台管理系统中，在主应用中我们要用的是子应用的container，左侧的导航栏和顶部的功能栏仅在单独使用子应用系统时出现，所以，在子应用Layout组件里可以根据是否是qiankun**可以根据window上是否有\_\_POWERED\_BY\_QIANKUN\_\_变量来断定**来判断需不需要导航栏

```html
<template>
  <el-container v-if="isQiankun">
    <el-main>
     ...
    </el-main>
  </el-container>
  
  <el-container v-else>
    <el-header>Header</el-header>
    <el-container>
      <el-aside>
        <el-menu>
         ...
        </el-menu>
      </el-aside>
      <el-main >
        ...
      </el-main>
    </el-container>
  </el-container>
</template>
```

至此，我们的改造就完成了，具体代码可见仓库

## 多tabs保活

对于单独的主子应用来说，可以使用`keep-alive`来做保活，但是当我们由子应用切换至主应用的时候，子应用就会被卸载，子应用的dom自然也不会存在，也就失去了保活，当然我们可以使用`loadMicroApp`手动控制加载哪个子应用，当属于子应用tab全部关闭时卸载，其他情况下可以使用`v-show`来暂时隐藏，但是这就产生了一个问题，当我是管理员角色的时候，就会有很多菜单，通过`v-show`的话势必会产生一些没必要的dom是事件。

vue在渲染时会执行`patch`,而组件在`patch`过程中会执行`createComponent`方法,初次渲染时,父组件`keep-alive`的`render`函数会先执行,会将组件vnode存在缓存中并设置`data.keepAlive`为`true`,但是此时还没有组件实例,所以会正常执行`init`函数并执行组件的`mount`,之后会缓存了vnode创建生成的DOM节点,所以对于初次渲染,`keep-alive`建立缓存之外,和普通组件渲染没什么区别。当切换组件,就会命中缓存,在创建组件时会定义钩子函数,例如`init、prepatch`等,在diff之前,会执行`prepatch`钩子函数,主要是去更新组件实例的一些属性,由于`keep-alive`组件本质支持了`slot`,所以再执行`prepatch`时候,需要对自己的`children`做重新解析。并触发`keep-alive`组件实例的`$forceUpdate`逻辑,也就是会重新执行`keep-alive`的`render`方法。再次渲染子组件时,由于有缓存并且`data.keepAlive`是`true`,所以不会再走init方法,将缓存的DOM对象直接插入到目标元素中,完成渲染过程

那么我们就可以参照渲染过程，在子应用卸载时，也就是执行`unmount`函数时，将子应用的整个实例的vnode储存起来，并将`keepAlive`属性设置为`true`，当再次进入子应用时优先检查是否有缓存的vnode，有就直接渲染。另外，我们还得注意，在移除掉一个tab时如果这个tab是属于某一个子应用的，应当去检查剩余的tab是否还有该子应用的，如果没有了，就得将缓存中的子应用vnode一并删除

### 设置缓存函数类

可以将子应用的所有缓存储存操作放在主应用里，方便管理，暴露出方法供子应用调用即可

```js
// src/util/globalMethods.js
class Cache {

  constructor(){
    this.loadedMicroApp = new Map()
  }

  dealCache(instance, key){
    return new Promise((resolve, reject) => {
      const needCached = this.getCache(key) || instance // 优先使用最初的实例
      const cachedInstance = {}
      cachedInstance._vnode = needCached._vnode
      if(!cachedInstance._vnode.data.keepAlive)cachedInstance._vnode.data.keepAlive = true
      this.loadedMicroApp.set(key, cachedInstance)
      instance.$destroy()
      resolve()
    })
  }
  
  getCache(key){
    return this.loadedMicroApp.get(key)
  }
  
  delCache(key){
    this.loadedMicroApp.delete(key)
  }
}
 export default Cache
```

此之所以使用类来作缓存而不是本地缓存的原因在于，防止刷新网页后vnode还在，当然也可以使用，主要考虑与`keep-alive`保持一致(试想，当刷新后，主应用保活的状态不在了，但是子应用的还在，产品是不是得找你了🙅‍♂️)

然后将类实例暴露出去，保证子应用和主应用调用的是同一个类方法

```js
// main.js
let cache = new Cache()
Vue.prototype.Cache = cache
window.globalMethods = cache
```

### 子应用入口改造

在主应用注册子应用的时候，通过prop把子应用的名称传递过来，可以用这个名称来做缓存的key，在子应用卸载时去调用主应用提供的储存方法进行储存vnode，渲染时获取缓存

```js
// main.js
let instance = null, microName = ''
function render(props = {}, cacheNode) {
  const { container, name } = props
  microName = name
  instance = new Vue({
    router,
    store,
    render: cacheNode ? () => cacheNode._vnode : h => h(App),
  })
  instance.$mount(container ? container.querySelector("#micro1") : "#micro1") 
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
} else {
  render()
}

export async function mount(props) {
  let cacheNode = window.globalMethods.getCache(microName)
  render(props, cacheNode)
}
export async function unmount() {
  window.globalMethods.dealCache(instance, microName).then(() => {
    instance = null
  })
}
```

### 移除tab时检查

在主应用中点击移除tab时可以做一个检查，没有子应用的tab时将缓存清除

```js
// src/page/tabs.vue
removeTab(value) {
  let {tag, key, componentName} = this.findTag(value)
  if(key == 0) return
  this.$store.commit("DEL_TAG", tag)
  this.$store.commit("DEL_KEEPALIVE", componentName)
  if (tag.value === this.tag.value) {
    let newTag = this.tagList[key === 0 ? key : key - 1] //如果关闭本标签让前推一个
    this.openTag(newTag)
  }
  this.removeMicro(tag)
},
removeMicro(tag) {
  // 如果不是子应用的tab直接返回
  if(!isMicroApp(tag.value)) return
  let microName = tag.value.split('/')[1]
  for(let i = 0; i < this.tagList.length; i++) {
    let tagValue = this.tagList[i].value
    if(tagValue.startsWith('/' + microName))return
  }
  let keyObj = microAppConfig.filter(item => item.activeRule == '#/' + microName)
  // 清楚缓存
  this.Cache.delCache(keyObj[0].name)
},
```

## 问题处理

### 1.缓存后再次进入子应用后路由失效

> 每当激活同一文档中不同的历史记录条目时，`popstate` 事件就会在对应的 `window` 对象上触发

因为在子应用卸载时移除了对popstate事件的监听，可以重新实例化一个vue-router来对popstate事件的监听，同时还需要缓存关于路由的一些信息

```js
// 主应用 src/util/globalMethods.js
class Cache {
  constructor(){
    this.loadedMicroApp = new Map()
  }

  dealCache(instance, key){
    return new Promise((resolve, reject) => {
      const needCached = this.getCache(key) || instance
      const cachedInstance = {}
      cachedInstance._vnode = needCached._vnode
      // 缓存路由相关信息
      cachedInstance.routeCache = {
        $router: instance.$router,
        apps: [...instance.$router.apps],
        currentRoute: instance.$route.path
      }
      if(!cachedInstance._vnode.data.keepAlive)cachedInstance._vnode.data.keepAlive = true
      this.loadedMicroApp.set(key, cachedInstance)
      instance.$destroy()
      resolve()
    })
  }
  
  getCache(key){
    return this.loadedMicroApp.get(key)
  }
  
  delCache(key){
    this.loadedMicroApp.delete(key)
  }
}
 export default Cache
```

```js
//  子应用 src/main.js

import { initRouter } from './router'
...

let instance = null, microName = ''
function render(props = {}, cacheNode) {
  // 重新实例化
  const router = initRouter()
  const { container, name } = props
  microName = name
  if(cacheNode) router.apps = cacheNode.routeCache.apps
  instance = new Vue({
    router,
    store,
    render: cacheNode ? () => cacheNode._vnode : h => h(App),
  })
  instance.$mount(container ? container.querySelector("#micro1") : "#micro1") 
}
...
```

### 2.加载子应用后刷新页面白屏

由于刷新后初次没有监听路由，导致主应用认为当前路由不是子应用的，在监听路由时加上`immediate: true`

```js
// 主应用 src/page/index.vue
watch: {
  '$route.path': {
    handler: function(val){
      this.isMicroApp = isMicroApp(val)
    }, 
    immediate: true
  }
},
```

## 总结

通过改造后台管理系统为 qiankun 微前端架构，可以实现模块化开发和独立部署，同时使用多个 Tabs 页面保持活动状态，提高用户体验。重点是将后台管理系统拆分为独立的子应用，注册子应用到主应用中，并实现路由切换、资源加载、隔离和多 Tabs 页面的状态管理、导航和缓存复用等功能。

参考阅读:\
[基于微前端qiankun的多页签缓存方案实践](https://juejin.cn/post/7127082488114970631#heading-9)\
[qiankun issue#361](https://github.com/umijs/qiankun/issues/361)
