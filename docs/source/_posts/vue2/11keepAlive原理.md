---
title: keep-alive原理
categories: 
  - Vue2
tags: 
  - Vue2
---

## 作用

使用`keep-alive`包裹动态组件时,会对组件进行缓存,避免组件的重新渲染

## 用法

- 动态组件

```html
<keep-alive :include="whiteList" :exclude="blackList" :max="count">
  <component :is="component"></component>
</keep-alive>
```

- `keep-alive`

```html
<keep-alive :include="whiteList" :exclude="blackList" :max="count">
  <router-view></router-view>
</keep-alive>
```

## 初始化

在初始化全局 api 时,会构建 keep-alive

```js
// src/core/global-api
import builtInComponents from '../components/index'
...
extend(Vue.options.components, builtInComponents)
```

## 定义

如果有缓存,使用 lru 算法(最近最久未使用):将组件先删除再添加进去,例如有 a,b,c,d 四个组件,用 c 时,先将 c 删除,再添加到 d 后边

```js
export default {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes, // 白名单
    exclude: patternTypes, // 黑名单
    max: [String, Number], // 缓存的最大个数
  },
  methods: {
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this;
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache;
        // 缓存组件
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag,
          componentInstance,
        };
        keys.push(keyToCache);
        // 超过最大限制删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
        this.vnodeToCache = null;
      }
    },
  },
  created() {
    this.cache = Object.create(null); // 缓存列表
    this.keys = []; // 缓存的key列表 缓存组件实例
  },
  destroyed() {
    // keep-alive销毁时,删除所有缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted() {
    // 监控缓存列表
    this.cacheVNode();
    this.$watch('include', (val) => {
      // 缓存列表可以是动态的
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch('exclude', (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },
  updated() {
    this.cacheVNode();
  },
  render() {
    const slot = this.$slots.default; // 获取默认插槽
    const vnode: VNode = getFirstComponentChild(slot); // 获得第一个组件
    // 复用了之前缓存中的组件实例
    const componentOptions: ?VNodeComponentOptions =
      vnode && vnode.componentOptions;
    if (componentOptions) {
      const name: ?string = getComponentName(componentOptions);
      const { include, exclude } = this;
      if (
        // 获取组件名 看是否需要缓存 不需要则直接返回
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode; // 不需要缓存 直接返回虚拟节点
      }
      const { cache, keys } = this;
      // 缓存的key为组件的id+标签名
      const key: ?string =
        vnode.key == null
          ? componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key;
      //如果有key 将组件实例直接复用
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // lru算法
        remove(keys, key);
        keys.push(key);
      } else {
        this.vnodeToCache = vnode;
        this.keyToCache = key;
      }
      // 组件被keep-alive 防止组件在初始化时候重新init
      vnode.data.keepAlive = true;
    }
    // 先渲染 当前对应的组件内容 返回组件的虚拟节点 之后将节点初始化时跳过渲染流程，不执行init 会执行activated 和 deactivated钩子(可做拉取最新数据的操作)
    return vnode || (slot && slot[0]);
  },
};
```

## 总结

`keep-alive`的用法有两种,一种是动态组件,另一种是`router-view`,由于`keep-alive`只处理第一个子元素,所以一般这两种方式搭配使用.可以通过`include`和`exclude`设置白名单和黑名单,通过`max`设置缓存的个数。vue 在渲染时会执行`patch`,而组件在`patch`过程中会执行`createComponent`方法,初次渲染时,父组件`keep-alive`的`render`函数会先执行,会将组件 vnode 存在缓存中并设置`data.keepAlive`为`true`,但是此时还没有组件实例,所以会正常执行`init`函数并执行组件的`mount`,之后会缓存了 vnode 创建生成的 DOM 节点,所以对于初次渲染,`keep-alive`建立缓存之外,和普通组件渲染没什么区别。当切换组件,就会命中缓存,在创建组件时会定义钩子函数,例如`init、prepatch`等,在 diff 之前,会执行`prepatch`钩子函数,主要是去更新组件实例的一些属性,由于`keep-alive`组件本质支持了`slot`,所以再执行`prepatch`时候,需要对自己的`children`做重新解析。并触发`keep-alive`组件实例的`$forceUpdate`逻辑,也就是会重新执行`keep-alive`的`render`方法。再次渲染子组件时,由于有缓存并且`data.keepAlive`是`true`,所以不会再走 init 方法,将缓存的 DOM 对象直接插入到目标元素中,完成渲染过程
