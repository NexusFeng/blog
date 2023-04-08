---
title: 关于this
date: 2022-02-12
categories: 
  - JavaScript
tags: 
  - JavaScript
---

## 事件绑定

- 不论 DOM0 还是 DOM2 级事件绑定,给元素 el 的某个时间绑定行为,当事件触发时,方法中的 this 指向元素 el
  (特殊情况: IE6-IE8 中,基于 attachEvent 绑定的事件,this 指向 window,call/apply/bind 强制改变了函数中的 this 的指向)

## 普通函数执行

函数执行看该函数前面是否有点,有点,点前面是谁,this 指向谁;没有点,非严格模式下,指向 window,严格模式下指向 undefined;自执行函数:非严格模式下,指向 window,严格模式下指向 undefined

- 函数调用模式: 当一个函数不是一个对象的属性时,直接作为函数来调用,this 指向全局对象
- 方法调用模式: 当一个函数作为一个对象的方法调用时,this 指向这个对象
- 构造器调用模式: 当一个函数用 new 调用时,函数执行前会创建一个新对象,this 指向这个新创建的对象
- bind/apply/call 改变 this 指向

优先级: new 绑定 > 显示绑定(apply/call/bind) > 隐式绑定(obj.foo()) > 默认绑定(独立函数调用)  
**new 不能和 apply/call 同时使用,他们都是调用函数,在用 new 实例化一个 bind 的函数时,bind 的 this 会失效,此时 this 指向 new 的实例**  
**apply/call/bind:当传入 null/undefined 时,自动将 this 绑定成全局对象**

```js
var obj = {
  name: 'obj',
  foo: function () {
    console.log(this);
  },
};

obj.foo(); // obj

// call/apply显示绑定优先级高于隐式绑定
obj.foo.call('abc'); // abc

var bar = obj.foo.bind('cba');
bar(); // cba

var f = new obj.foo(); //f
```

## 示例

```js
const boxDiv = document.querySelector('.box')
boxDiv.onclick = function() {
  console.log(this) // dom元素
}

//
let name = ['abc', 'nba', 'cba']
name.forEach(function(item) => {
  console.log(this) // window
})// map 同理，可通过传入第二个参数改变this

var obj1 = {
  name: 'obj1',
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: 'obj2'
}

obj2.bar = obj1.foo
obj2.bar()  // obj2

(obj2.bar = obj1.foo)() // undefined


function foo(el){
  console.log(el, this.id)
}
var obj = {
  id: 'awesome'
} // 此处得加;
[1,2,3].forEach(foo, obj) // 报错
```
