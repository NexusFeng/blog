#### 0.1+0.2 !=0.3原因
小数在转换二进制的时候,结果是无限循环的,计算机在存储的时候,存储位数是有限的,那麽就必须做一些近似值的取舍,这样就导致小数精度丢失了  
解决: 先将小数乘以10的n次方,装换为整数,再将计算后的结果值除以10的n次方
#### 类数组转化为数组
- `Array.prototype.splice.call(likeArray,0)`
- `Array.prototype.slice.call(likeArray)`
- `Array.from(likeArray)`
- `Array.prototype.concat.apply([], likeArray)`
- 扩展运算符
```js
function fn(){
  let arr = [...arguments]
  return arr
}
console.log(fn(1,2,3,4,5))// [1,2,3,4,5]
```