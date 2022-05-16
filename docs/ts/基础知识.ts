// 与js的区别
// - ts是js的超集
// - ts是静态类型,js是动态类型
// - ts通过编译在浏览器中运行
// 优势
// - 在开发过程中,发现潜在问题
// - 编辑器提示友好
// - 类型声明可读性好，代码逻辑性好

// 静态类型
const count: number = 2022
// count = {} 出错

interface Point {
  x: number,
  y: number
}
// const point: Point = 2022 出错
const point: Point = {
  x: 3,
  y: 4
}

// 类型
// 基础类型 null,undefined,symbol,boolean,void
const count1: number = 123
const youName: string = 'feng'

// 对象类型
const obj: {
  name: string,
  age: number
} = {
  name: 'feng',
  age: 11
}

const numbers: number[] = [1,2,3]

const getTotal: () => number = () => 123

class Person {}
const vivi: Person = new Person()

// 类型注解 告诉ts变量是什么类型
let counts: number
 counts = 123
// 类型注释  ts通过赋值自动来推断变量类型
let countInference = 123
// 在ts能自动分析变量类型时,不需要写,无法分析时,需要写类型注解
const firstName = 1
const secondName = 2
const total = firstName + secondName

// 形参需要类型注解firstName, secondName类型不确定,可以传任意值
function getToals(firstName, secondName) {
  return firstName + secondName
}
const totals = getToals(1,2)

// 函数
function add(first: number, second: number): number {
  return first + second
}
const sum = add(1,2)

function sayHello(): void{
  console.log('hello')
}

function errorEmitter(): never { //函数可能永远也执行不完
  throw new Error()
  console.log(111)
}

function adds({first, second} : {first: number, second: number}) : number {
  return first + second
}
const two = adds({first: 1, second: 2})