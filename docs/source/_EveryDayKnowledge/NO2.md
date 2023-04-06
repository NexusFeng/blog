# 每天一个小知识点

## 第二天

---

## 如何在不调用一个类的前提下,去自动实例化一个类出来？

这样写其实是一个创建好的单例模式

```js
class example {
  static newExample = new example();
  constructor() {
    console.log('我被调用了');
  }
  getItem() {
    console.log(111);
  }
}
example.newExample.getItem();
example.newExample.getItem();
//打印结果
我被调用了;
111;
111;
```

不执行`example.newExample.getItem()`,依旧会打印‘我被调用了’  
静态属性它和类的实例无关，在创建类的时候就会被分配内存空间。但是如果不是静态属性和方法就不会执行，只有等到实例对象调用的时候才会执行
