---
title: 10.全局api原理
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
// src/core/global-api/use.js
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
主要遍历父和子的属性进行合并,如果合并选项有自己的合并策略,就使用对应的合并策略,合并生命周期时将其合并成一个数组依次调用
```js
// src/core/global-api/mixin.js
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
// src/core/util/options.js
export function mergeOptions (parent,child,vm) {
  if (typeof child === 'function') {
    child = child.options
  }
  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)
  // Vue.mixin将属性全部放在Vue.options中, mixins是局部
  // 组件 将自己定义的extends和mixins与父属性进行合并
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    // mixins 的原理就是 做合并选项的
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }
  const options = {}
  let key
  // 将子属性和父属性进行合并
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    // 优先使用合并策略,找不到就使用默认的合并策略
    const strat = strats[key] || defaultStrat
    // 策略模式
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```
## Vue.filter
过滤器全局注册的过滤器和全局注册组件方式一致,都会统一挂载到`Vue.options.filters`属性上,局部注册的过滤器在解析`{{}}`中的文本时会利用正则将其解析出来,存放在一个数组里循环调用,最终编译成`_f()`函数形成`render`函数
- `<div :id="rawId | formatId"></div>`
- `{{ id |  formatId}}`
- `{{ id |  formatId(arg)}}`
- `{{ id |  formatId1 | formatId2}}`
```js
// 局部过滤器
filters: {
  formatId: function(val){
    return val + 1
  }
}
// 全局注册
Vue.filter('formatId', function(val){
  return val + 1
})
```
## Vue.directive
过滤器全局注册的过滤器和全局注册组件方式一致,在生成ast语法树时,遇到指令会给当前元素添加`directives`属性,通过`genDirectives`生成指令代码,在patch前将对应的钩子提取到`cbs`中,在patch过程中调对应指令定义的方法
```js
// src/core/vdom/modules/directives.js
// 定义create、update、destroy方法,在patch过程中会调用
export default {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode)
  }
  function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode)
  }
}

function _update (oldVnode, vnode) {
  ...
  let key, oldDir, dir
  for (key in newDirs) {
    oldDir = oldDirs[key]
    dir = newDirs[key]
    if (!oldDir) {
      callHook(dir, 'bind', vnode, oldVnode)
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir)
      }
    } else {
      dir.oldValue = oldDir.value
      dir.oldArg = oldDir.arg
      callHook(dir, 'update', vnode, oldVnode)
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir)
      }
    }
  }
  if (dirsWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirsWithInsert.length; i++) {
        callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
    }
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert)
    } else {
      callInsert()
    }
  }
  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', () => {
      for (let i = 0; i < dirsWithPostpatch.length; i++) {
        callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
      }
    })
  }
  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
      }
    }
  }
}
}
// src/core/vdom/patch.js
// vue内部名字
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
}
```