---
title: vue-loader原理记录
date: 2023-04-24
categories: 
  - 工程化
tags: 
  - Webpack
  - 工程化
  - 学习笔记
---

## 概述
主要包括三部分:
- normal loader
- pitcher loader
- VueLoaderPlugin插件
运行过程可以看做两个阶段: 
1.预处理阶段-在插件apply函数内动态修改webpack配置,注入vue-loader专用的rules
2.内容处理阶段-normal loader配合pitcher loader完成文件内容转换
## 预处理阶段
插件代码:
```js
class VueLoaderPlugin {
  apply (compiler) {
    // ...

    const rules = compiler.options.module.rules
    // ...

    const clonedRules = rules
      .filter(r => r !== rawVueRules)
      .map((rawRule) => cloneRule(rawRule, refs))

    // ...
    // resourceQuery属性是匹配的关键点
    const pitcher = {
      loader: require.resolve('./loaders/pitcher'),
      resourceQuery: query => {
        if (!query) { return false }
        const parsed = qs.parse(query.slice(1))
        return parsed.vue != null
      }
      // ...
    }
    // replace original rules
    compiler.options.module.rules = [
      pitcher,
      ...clonedRules,
      ...rules
    ]
  }
}

function cloneRule (rawRule, refs) {
    // ...
}

module.exports = VueLoaderPlugin
```
主要的任务: 
- 1.初始化pitcher,指定pitcher loader(针对xx.vue&vue路径生效的规则)路径，将pitcher注入到rules数组的首位(将pitcher注入到其他rules之前，确保执行顺序)
- 2.复制webpack配置中的modules.rules数组，将webpack配置修改为[pitcher loader, ...cloneRules, ...rules]
在复制的cloneRules过程中,use数组与开发时定义的规则相同,同时重新定义resourceQuery函数(**用于判断资源路径是否适用于这个rule,这里也就是取出路径中的`lang参数`,vue-loader基于这个规则为不同模块(css/js/template)匹配、复用用户提供的rule设置**)
```js
// 命中/./js$/i规则
import script from './index.vue?vue&type=script&lang=js'
```
## 内容处理阶段
插件处理完配置后,webpack开始运行,vue文件会多次传入不同的loader,处理成最终的js文件,大致步骤:
- 路径命中`/.vue$/i`,调用vue-loader(normal loader)生成中间结果A
- 结果A命中xx.vue?vue规则,调用vue-loader生成中间结果B
- 结果B命中具体的loader，直接调用loader做处理
具体细节:
- 1.第一次执行vue-loader: 根据配置规则,webpack首先会将SFC内容传入vue-loader
  - 调用`@vue/component-compiler-utils`包的parse函数,将SFC内容解析为AST对象
  - 遍历AST对象属性,转换为特殊的引用路径
  - 返回结果
```js
// 这些路径都对应原始的 .vue 路径基础上增加了 vue 标志符及 type、lang 等参数
Script："./index.vue?vue&type=script&lang=js&"
Template: "./index.vue?vue&type=template&id=2964abc9&scoped=true&"
Style: "./index.vue?vue&type=style&index=0&id=2964abc9&scoped=true&lang=css&"
```
- 2.执行pitcher: 第一步转换后的import路径会被pitcher命中,做进一步处理,核心功能是遍历用户自定义的rule数组,拼接出完整的行内引用路径

- 3.第二次执行vue-loader: webpack调用vue-loader处理生成的新的行内引用路径文件，之后调用之后调用相应的loader处理内容
