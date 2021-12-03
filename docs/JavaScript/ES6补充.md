#### Number.EPSILON
极小的常量,表示1与大于1的最小浮点数之间的差。是js能够表示的最小精度,误差如果小于这个值,就可以认为已经没有意义了,即不存在误差.实质上是一个可以接受的最小误差范围
```js
Number.EPSILON === Math.pow(2, -52)// true
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```