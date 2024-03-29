---
title: Ajax
date: 2021-09-19
categories: 
  - JavaScript
tags: 
  - JavaScript
---

## 前置

- XMLHttpRequest 是由浏览器的其他进程或发起请求,然后再将执行结果利用 IPC(进程间通信)的方式通知渲染进程,之后渲染进程再将对应的消息添加到消息队列中

```js
// get请求
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api', true); //true代表异步,false代表同步
xhr.onreadystatechange = function () {
  // 异步函数执行
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    }
  }
};
xhr.send(null);

// post
const xhr = XMLHttpRequest();
xhr.open('POST', '/api', true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    }
  }
};
const postData = {
  userName: 'zz',
  password: '123',
};
xhr.send(JSON.stringify(postData));
```

## 简易 Ajax

```js
function ajax(url) {
  const p = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else if (xhr.status === 404) {
          reject(new Error('404'));
        }
      }
    };
    xhr.send(null);
  });
  return p;
}
```
