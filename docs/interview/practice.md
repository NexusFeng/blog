## Ajax Fetch Axios 三者的区别

**三者都是用于网络请求,但是不同维度**

- Ajax 是一种技术统称
- Fetch 是浏览器原生 api,用于网络请求,和 XMLHttpRequest 一个级别,语法更加简洁、易用,支持 Promise

```js
function ajax1(url, successFn) {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url, false)
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 20) {
        successFn(xhr.responseText)
      }
    }
  }
  xhr.send(null)
}

function ajax2(url) {
  return fetch(url).then((res) => res.json())
}
```

- axios 是第三请求工具方库，内部可用 XMLHttpRequest 和 Fetch 来实现

## 防抖和节流的区别以及应用场景

- 防抖: 动作绑定事件,动作发生一定时间后触发事件,在这段时间内,如果该动作又发生,则重新等待一定的时间再触发事件,例: 搜索框输入

```js
function debounce(fn, delay) {
  let timer = 0
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```

- 节流:动作绑定事件,动作发生一段时间后触发事件,在这段时间内,如果动作又发生,则无视该动作,直到这段时间后,才重新触发,例如: drag 或 scroll 期间触发某个回调,要设置一个时间间隔

```js
function throttle(fn, delay) {
  let timer = 0
  return function() {
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = 0
    }, delay)
  }
}
```
