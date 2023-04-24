---
title: Vue3基础
date: 2021-04-12
categories: 
  - Vue3
tags: 
  - Vue3
  - 学习笔记
---

## setUp 参数

- setUp 内部避免使用 this
- props:父组件传递的属性
- context: 上下文对象,包含三个属性:attrs、slots、emit

## isProxy

检查对象是否是由 reactive 或者 readonly 创建的 proxy

## isReactive

- 检查对象是否是由 reactive 创建的响应式代理
- 如果**该代理是 readonly 建的**,但**包裹了右 reactive 创建的另一个代理**,它也会返回 true

## isReadonly

检查对象是否是由 readonly 创建的只读代理

## toRaw

返回 reactive 或 readonly 代理的原始对象

## toRefs

- 如果使用 es6 的结构语法,对 reactive 返回的对象进行结构获取值,那么修改结构后的变量,还是修改 reactive 返回的 state 对象,**数据都不会是响应式的**
- 利用 toRefs 函数,可以将 reactive 返回的对象中的属性都转为 ref,任何一个修改都会引起另一个变化

```js
const state = reactive({ name: 'feng', age: 18 });
const { name, age } = toRefs(state);
```

## toRef

- toRefs 是对 reactive 内所有的属性都转为 ref,建立链接
- toRef 对其中一个属性进行转换 ref,建立链接,两个参数

```js
const name = toRefs(state, 'name');
```

自定义 ref

```js
import { customRef } from 'vue';

export default function (value, delay = 300) {
  let timer = null;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
```

## computed

**computed 返回值是一个 ref 对象**

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

## $ref 拿元素节点

```html
<h2 ref="title">111</h2>

<script>
  import { ref, watchEffect } from 'vue';

  export default {
    setUp() {
      const title = ref(null);
      watchEffect(
        () => {
          console.log(title);
        },
        {
          flush: 'pos', //dom更新完执行回调
        },
      );
      return {
        title,
      };
    },
  };
</script>
```

## watch

与 options API 无差异

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

setup 是围绕 beforeCreate 和 created 生命周期钩子运行的,所以不需要定义,所有的操作在 setup 中也能触发

```html
<script>
  import { onMounted, onUpdated, onUnmounted } from 'vue';

  export default {
    setup() {
      onMounted(() => {});
    },
  };
</script>
```

## provide & inject

```html
<script>
  // 父
  import { provide, ref, readonly } from 'vue';

  export default {
    setup() {
      const name = ref('feng');

      provide('name', readonly(name));
    },
  };
</script>

<script>
  // 子孙组件
  import { inject } from 'vue';

  export default {
    setup() {
      const name = inject('name');
      return {
        name,
      };
    },
  };
</script>
```

## 顶层编写方式

```html
<template>
  <h2>{{name}}</h2>
</template>
<script setup>
  import { provide, ref, readonly, defineProps, defineEmit } from 'vue';
  const name = ref('feng');
  provide('name', readonly(name));
  const props = defineProps({
    message: {
      type: String,
      default: 'feng',
    },
  });
  const emit = defineEmit(['increment', 'decrement']);
  emit('increment', {});
</script>
```

## h 函数

```html
<script>
  import { h, ref } from 'vue';

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
      const counter = ref(0);
      return () => {
        return h('h2', { class: 'title' }, [
          h('h2', null, `当前计数${counter.value}`),
          h(
            'button',
            {
              onClick: () => counter.value++,
            },
            '按钮',
          ),
        ]);
      };
    },
  };
</script>
```
