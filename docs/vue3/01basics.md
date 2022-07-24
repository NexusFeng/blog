---
title: 1.基础
---
## setUp参数
- setUp内部避免使用this
- props:父组件传递的属性
- context: 上下文对象,包含三个属性:attrs、slots、emit

## isProxy
检查对象是否是由reactive或者readonly创建的proxy
## isReactive
- 检查对象是否是由reactive创建的响应式代理
- 如果**该代理是readonly建的**,但**包裹了右reactive创建的另一个代理**,它也会返回true
## isReadonly
检查对象是否是由readonly创建的只读代理
## toRaw
返回reactive或readonly代理的原始对象
## toRefs
- 如果使用es6的结构语法,对reactive返回的对象进行结构获取值,那么修改结构后的变量,还是修改reactive返回的state对象,**数据都不会是响应式的**
- 利用toRefs函数,可以将reactive返回的对象中的属性都转为ref,任何一个修改都会引起另一个变化
```js
const state = reactive({name: 'feng', age: 18})
const { name, age } = toRefs(state)
```
## toRef
- toRefs是对reactive内所有的属性都转为ref,建立链接
- toRef 对其中一个属性进行转换ref,建立链接,两个参数
```js
const name = toRefs(state, 'name')
```
自定义ref
```js
import { customRef } from 'vue'

export default function(value, delay = 300) {
  let timer = null
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```
## computed
**computed返回值是一个ref对象**
```js
import { ref, computed} form 'vue'

setUp() {
  const firstName = ref('nexus')
  const secondName = ref('feng')

  // 写法一
  const fullName = computed(() => firstName.value + secondName.value)
  // 写法二
  const fullName = computed({
    get:() => {},
    set: () =>{}
  })
}
```

## watchEffect
自动收集响应式依赖,**回调函数会初始会立即执行一次**,依赖发生变化执行
```js
import { ref, watchEffect} form 'vue'

setUp() {
  const firstName = ref('nexus')
  const secondName = ref('feng')

  const stop = watchEffect( () => {
    console.log(firstName.value,secondName.value)
  })

  if(){
    stop()// 停止监听
  }

}
```

## $ref拿元素节点
```html
<h2 ref = "title">111</h2>

<script>
import {ref,watchEffect} from 'vue'

export default {
  setUp() {
    const title = ref(null)
    watchEffect( () => {
      console.log(title)
    }, {
      flush: "pos"//dom更新完执行回调
    })
    return {
      title
    }
  }
}
</script>

```
## watch
与options API无差异
```js
import { ref, watch} form 'vue'

setUp() {
  const info = reactive({name: 'feng', age: 18})
  const secondName = ref('feng')
  //1
  watch(() => info.name,  (newVal, oldVal) => {
    console.log(newVal,oldVal)
  },{
    deep: true
  })

  //2 传入一个可响应式对象
  // reactive对象获取到的新老值都是reactive对象
  // watch(info,  (newVal, oldVal) => {
  //   console.log(newVal,oldVal)
  // })
  // 转为普通函数
  // watch(() => {
  //  return {...info}
  // },  (newVal, oldVal) => {
  //   console.log(newVal,oldVal)
  // })

  //3 传入一个ref对象
  // 获取到的新老值是value本身
  // watch(secondName,  (newVal, oldVal) => {
  //   console.log(newVal,oldVal)
  // })
}
```
## 生命周期
setup是围绕beforeCreate和created生命周期钩子运行的,所以不需要定义,所有的操作在setup中也能触发
```html
<script>
  import {onMounted, onUpdated, onUnmounted} from 'vue'

  export default {
    setup() {
      onMounted(() => {

      })
    }
  }
</script>

```

## provide & inject
```html

<script>
  // 父
  import {provide, ref, readonly} from 'vue'

  export default {
    setup() {
      const name = ref('feng')

      provide('name', readonly(name))
    }
  }
</script>

<script>
  // 子孙组件
  import {inject} from 'vue'

  export default {
    setup() {
      const name = inject('name')
      return {
        name
      }
    }
  }
</script>

```

## 顶层编写方式
```html
<template>
  <h2>{{name}}</h2>
</template>
<script setup>
  import {provide, ref, readonly, defineProps, defineEmit} from 'vue'
  const name = ref('feng')
  provide('name', readonly(name))
  const props = defineProps({
    message: {
      type: String,
      default: 'feng'
    }
  })
  const emit = defineEmit(['increment', 'decrement'])
  emit('increment', {})
</script>
```
## h函数
```html
<script>
  import {h, ref} from 'vue'

  export default {

    // data() {
    //   return {
    //     counter: 0
    //   }
    // }
    // setup() {
    //   const counter = ref(0)
    //   return {
    //     counter
    //   }
    // }

    // render() {
    //   return h('h2', {class: 'title'}, [
    //     h('h2', null, `当前计数${this.counter}`),
    //     h('button', {
    //       onClick: () => counter++
    //     }, "按钮")
    //   ])
    // }

    setup() {
      const counter = ref(0)
      return () => {
          return h('h2', {class: 'title'}, [
            h('h2', null, `当前计数${counter.value}`),
            h('button', {
              onClick: () => counter.value++
            }, "按钮")
          ])
      }
    }
  }

</script>
```