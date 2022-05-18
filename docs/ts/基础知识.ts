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
const obj1: {
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

// 数组
const numberArr: (number | string)[] = [1,2,3, 'str']
const undefinedArr: undefined[] = [undefined]

// type alias
type User = {name: string, age: number}
const objArr: User[] = [
  {
    name: 'feng',
    age: 28
  }
]

// ts不会强制每一项都是一个class类
class Teachers {
  name: string
  age: number
}
const objArr1: Teachers[] = [
  new Teachers(),
  {
    name: 'feng',
    age: 28
  }
]

// 元组 tuple 数量类型有限的数组
const teacherInfo: [string,string,number] = ['dell', 'nexus', 18]

const teachList:[string,string,number][] = [
  ['dell', 'feng', 17],
  ['dell', 'feng', 17],
  ['dell', 'feng', 17],
]

// interface接口 有通用性的类型集合可以提取出来
// 与type区别: type可以直接等于一个类型
interface Person {
  name: string,
  [propName: string]:any // 可添加其他的属性
  // readonly name: string 只读属性
}

// 接口继承
interface Student extends Person {
  eat(): string
}

// 定义函数类型声明,传入string,返回值string
interface SayHi {
  (word: string):string
}
const say: SayHi = (word: string) => {
  return word
}

// type Persons = {
//   name: string
// }
type Persons = string

const getPersonName = (person: Person):void => {
  console.log(person.name)
}

const setPersonName = (person:Person,name:string) => {
  person.name = name
}

const person = {
  name: 'feng'
}

getPersonName(person)
setPersonName(person, 'lee')

// 当以字面量形式传递参数时,ts会进行强校验
getPersonName({name: 'feng', sex: 'male'})

// 类应用接口
class Users implements Person {
  name = 'feng'
}

// 类的定义与继承
class Person1 {
  name = 'feng'
  getName() {
    return this.name
  }
}

const person1 = new Person1()

class Teacher1 extends Person1 {
  getTeacherName() {
    return 'nexus'
  }
  // 重写 调用父类方法
  getName() {
    super.getName()
    return this.name
  }
}

// 访问类型和构造器 private protected public
class Person2 {
  // public 允许在类内外被调用，默认
  // private 允许在类内被使用
  // protected允许在类内及继承的子类中使用
  public name: string
} 
const person2 = new Person2()
person2.name = 'feng'
console.log(person2.name)

// constructor
class Person3 {
  // 传统写法
  // public name: string
  // new时,constructor自动执行
  // constructor( ) {
    // this.name = name
  // }

  // 简化写法
  constructor( public name: string) { }// public name: string与注释的两句话等价
}

const person3 = new Person3('feng')
console.log(person3.name)

// 父类、子类如果都有构造器,子类必须得手动调用父类构造器
class Person4 {
  constructor(public name:string) {
  }
}
class Teacher2 extends Person4 {
  // sayHi() {
  //   this.name
  // }
  constructor(public age: number){
    super('feng')
  }
}
const teacher2 = new Teacher2(18)
console.log(teacher2.age)// 18
console.log(teacher2.name)// feng

// getter setter
class Person5 {
  constructor(private _name:string) {
  }
  get name() {
    return this._name
  }
  set name(name: string) {
    this._name = name
  }
}

const person5 = new Person5('feng')
console.log(person5.name)
person5.name = 'nexus'

// 创建一个单例模式
class Demo {
  private static instance: Demo
  private constructor(public name: string) {}
  // static将这个方法挂载类上而不是实例上
  static getInstance() {
    if (!this.instance) {
      this.instance = new Demo('feng')
    }
    return this.instance
  }
}

// demo1和demo2是完全相同的实例
const demo1 = Demo.getInstance()
const demo2 = Demo.getInstance()

// readonly
class Person6 {
  public readonly name: string
  constructor(name: string) {
    this.name = name
  }
  // get name() {
  //   return this._name
  // }
}

const person6 = new Person6('feng')
// person6.name = 'hello' 报错
console.log(person6.name)

// 抽象类不能实例化，只能被继承
abstract class Geom {
  width: number
  abstract getArea(): number
}

class Circle extends Geom{
  getArea(): number {
    return 123
  }
  // getArea() {

  // }
}
class Square {
  // getArea() {
    
  // }
}
class Triangle {
  // getArea() {
    
  // }
}

// 抽象

interface Person {
  name: string
}
interface Teacher extends Person {
  teachAge: number
}
interface Students extends Person {
  age: number
}

const teacher = {
  name: 'feng',
  teachAge: 23
}

const students = {
  name: 'lee',
  age: 18
}

const getUserInfo= (user: Teacher | Students) => {
  console.log(user.name)
}

getUserInfo(teacher)
getUserInfo(students)