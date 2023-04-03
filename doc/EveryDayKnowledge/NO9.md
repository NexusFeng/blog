# 每天一个小知识点

## 第九天

---

## 1、flex:1 代表什么意思？

flex 相关资源:<https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html>  
`flex:1;`是 flex-grow、flex-shrink、flex-basis 的减写,默认值是 0 1 auto,后两个属性可选  
`flex-grow`: 项目的放大比例,默认为 0  
`flex-shrink`: 项目的缩小比例,默认是 1(负值无效)  
`flex-basis`: 定义了再分配多余空间之间,项目占据的主轴空间,默认值 auto

## 2、单行文本溢出省略号和一个向下的三角形 css 样式怎么写？

```css
//单行
.item {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 多行
.item {
  width: 200px;
  word-break: break-all; //单词内换行
  display: -webkit-box; // 作为弹性伸缩盒子模型显示
  -webkit-line-clamp: 2; // 显示的行数
  -webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
  text-overflow: ellipsis; // 溢出用省略号显示
  overflow: hidden; // 溢出隐藏
}

// 向下的三角形
// no.1
// transparent: 透明的
.item {
  width: 0;
  height: 0;
  border-top: 50px solid red;
  border-right: 50px solid transparent;
  border-left: 50px solid transparent;
}
// no.2
.item {
  width: 0;
  height: 0;
  border: 50px solid;
  border-color: red transparent transparent transparent;
}
// no.3
.item {
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-top-color: red;
}
```

## 3、flex 布局有哪些常用的属性？

以下 6 个属性设置在*容器上*：  
`flex-direction:` 决定主轴的排列方向  
`flex-wrap:` 在轴线排不下的情况下,如何换行  
`flex-flow:` `flex-direction`和`flex-wrap`属性的简写方式,默认值是 `row nowrap`  
`justify-content:` 在主轴上的对齐方式  
`align-items:` 在交叉轴上的对齐方式  
`align-content:` 定义了多根轴线的对齐方式,如果项目只有一条轴线,该属性不起作用.

以下 6 个属性设置在*子元素上*：  
`order:` 项目的排列顺序,数值越小,排列越靠前,默认值为 0  
`flex-grow:` 定义项目的放大比例,默认为 0,即如果存在剩余空间,也不放大  
`flex-shrink:` 定义项目的缩小比例,默认为 1,即空间不足,该项目将缩小  
`flex-basis:` 定义了在分配多余空间之前,项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto,即项目的本来大小。  
`flex:` `flex-grow`、`flex-shrink`、`flex-basis`的缩写,默认值为 0 1 auto  
`align-self:` 允许单个项目与其他项目不一样的对齐方式,可覆盖 align-items 属性。默认为 auto.

## 4、css 如何开启硬件加速？

动画实现过程中利用 transform: translateZ(0)，欺骗浏览器开启 GPU 加速  
`will-change`开启 gpu 加速，就是性能不太好

## 5、如何在浏览器画出一个正方形并且保证这个正方形是浏览器可视区最大面积？

第一种

```css
body {
  margin: 0;
  padding: 0;
}
.box {
  width: 100vmin;
  height: 100vmin;
  background-color: #ccc;
  margin: 0 auto;
}
```

第二种

```html
<body>
  <div class="container"></div>
</body>
<style>
  .container {
    background-color: aqua;
    width: 100vmin;
    padding-top: 100vmin;
  }
</style>
```

第三种

```html
<body>
  <div class="container">
    <div class="child"></div>
  </div>
</body>
<style>
  .container {
    background-color: aqua;
    width: 100vmin;
  }
  .child {
    width: 100%;
    padding-top: 100%;
  }
</style>
```

第四种

```css
div::before {
  content: '';
  padding-top: 100%;
  display: block;
  width: 100vmin;
}
```
