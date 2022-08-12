---
title: 9.全局api原理
---

## Vue.set(vm.$set)/Vue.delete(vm.$delete)
`set`根据不同情况去处理,如果数组就调用`splice`为其添加值并触发更新,如果是对象就调用`defineReactive`将其定义为响应式属性并通知视图更新
```js
// src/core/observer/index.js
export function set (target, key, val) {
  // 如果是target是数组且key是数组索引,就调用splice为数组添加一个响应式的值
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 如果key是target上的属性直接设置val
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    return val
  }
  // 如果target不是响应式,直接添加值
  if (!ob) {
    target[key] = val
    return val
  }
  // 利用defineReactive将新增属性定义为响应式并通知视图更新
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```
`delete`也是根据不同情况处理,如果是数组调用`splice`删除元素,如果是响应式对象就删除属性并通知视图更新
```js
// src/core/observer/index.js
export function del (target, key) {
  // 如果是数组就删除
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    return
  }
  // 如果不是target上的属性就返回
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  // 如果target不是响应式就不通知视图更新
  if (!ob) {
    return
  }
  ob.dep.notify()
}
```
## Vue.use
使用`use`使用插件,可以在插件中**扩展**全局组件、指令、原型方法等,如果是对象,必须提供`install`方法,如果是函数,则被视为`install`方法
```js
export function initUse (Vue: GlobalAPI) {
   // 为了给Vue扩展功能 希望扩展的时候使用的vue版本一致
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    //如果插件安装过了,直接返回
    if (installedPlugins.indexOf(plugin) > -1) {
      return this 
    }
    const args = toArray(arguments, 1) // Array.from().slice(1)
    args.unshift(this) // 放入this [Vue, options]
    // plugin为对象是,必须有install方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    // plugin为函数
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    // 将安装过的插件保存起来
    installedPlugins.push(plugin)
    return this
  }
}
// 使用
const plugin1 = (Vue, options) => {
  ...
}
const plugin2 =  {
  install(Vue, options){
    ...
  }
}
Vue.use(plugin1, {options})
```
## Vue.mixin
