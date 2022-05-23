interface Bird {
  fly: boolean;
  sing: () => {}
}

interface Dog {
  fly: boolean;
  bark: () => {}
}

// 联合类型 ts不会对各自的方法进行提示<只会提示共有属性
// 1.类型断言方式进行类型保护
function trainAnial(animal: Bird | Dog) {
 if(animal.fly) {
    (animal as Bird).sing()
 } else {
    (animal as Dog).bark()
 }
}
// 2.in语法做类型保护
function trainAnialSecond(animal: Bird | Dog) {
  if('sing' in animal) {
    animal.sing()
  } else {
    animal.bark()
  }
 }

 // 3.typeof 语法来做类型保护
 function add(first: string | number, second: string | number){
  if (typeof first === 'string' || typeof second === 'string') {
    return `${first}${second}`
  }
  return first + second
 } 

//  4.使用instanceof语法来做类型保护
class NumberObj {
  count: number
}
function addSecond(first: object | NumberObj, second: object | NumberObj){
  if(first instanceof NumberObj && second instanceof NumberObj) {
    return first.count + second.count
  }
  return 0
} 


// 枚举类型
//js
const Status = {
  OFFLINE: 0,
  ONLINE: 1,
  DELETED: 2
}
function getResult(status) {
  // if(status === 0) {
  //   return 'offline'
  // } else if(status === 1) {
  //   return 'online'
  // } else if(status === 2){
  //   return 'deleted'
  // }
  if(status === Status.OFFLINE) {
    return 'offline'
  } else if(status === Status.ONLINE) {
    return 'online'
  } else if(status === Status.DELETED){
    return 'deleted'
  }
  return 'error'
}

const result = getResult(Status.OFFLINE)

//ts
enum Status1 {
  OFFLINE,
  // OFFLINE = 1, 设置枚举的值,默认是0，后边依次会加1，ONLINE 2， DELETED 3
  ONLINE,
  DELETED
}
console.log(Status.OFFLINE) //0
console.log(Status.ONLINE) //1
console.log(Status.DELETED) //2
function getResult1(status) {
  if(status === Status.OFFLINE) {
    return 'offline'
  } else if(status === Status.ONLINE) {
    return 'online'
  } else if(status === Status.DELETED){
    return 'deleted'
  }
  return 'error'
}
// const result1 = getResult1(Status.OFFLINE)
const result1 = getResult1(1)

// 泛型 generic 泛指的类型
function join<T,P>(first: T, second: P) {
  return `${first}${second}`
}

join<string,number>('1',1)
join<number, string>(1,'1')

// Array<T> 等价与 params: T[]
function map<T>(params: T[]):T[] {
  return params
}
join<number,number>(1,1)
// map<string>('123')
map<string>(['123'])

join(1,'1')

// 类中的泛型 
// class DataManager {
//   constructor(private data: string[]|number[]){}
//   getItem(index:number): string| number {
//     return this.data[index]
//   }
// }


interface Item {
  name: string
}

class DataManager<T extends Item> {
  constructor(private data: T[]){}
  getItem(index:number): string {
    return this.data[index].name
  }
}

const data = new DataManager([{name:'11'}])
data.getItem(0)

// 泛型类型 使用泛型作为一个具体的类型注解
function hello<T>(params: T) {
  return params
}
const func1: <T>(params: T) => T = hello


const func: <T>() => string = <T>() => {
  return '123'
}

// 命名空间
namespace Home {
class One{
  constructor() {}
}

class Two{
  constructor() {}
}
class Three{
  constructor() {}
}

export class Com {
  constructor() {
    new One()
    new Two()
    new Three()
  }
}
}

new Home.Com()// 调用命名空间的Com


