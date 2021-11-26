/**
 * 1.静态属性：定义在构造函数上的属性，可通过构造函数直接访问
 * 2.实例属性：定义在实例，可以在构造函数内部的this上进行定义，也可以在构造函数实例化后的实例上进行定义
 * 3.原型属性：定义在构造函数原型对象上的属性
 */
function Person(name){
    //在构造函数内部的this上进行定义的实例属性
    this.name=name;
}

// 静态属性
Person.sex='male';
// 原型属性
Person.prototype.weight=20;
let p1=new Person('john');
// 实例属性
p1.age=18;

// 访问实例属性
console.log(p1.name);  //john
// 访问实例属性
console.log(p1.age);   //18
// 访问静态属性
console.log(Person.sex); //male
// 实例能访问静态属性
console.log(p1.sex);  //undefined
// 访问原型属性
console.log(p1.weight); //20
// 通过构造函数访问原型属性
console.log(Person.prototype.weight);  //20

/**
 * 1.实例方法：定义在实例上，可以在构造函数内部的this上定义，也可以在构造函数实例化以后的实例上定义
 * 2.静态方法：定义在构造函数上的方法，可以通过构造函数直接调用
 * 3.原型方法：定义在构造函数原型对象上的方法
 */

function Student(name){
    this.name=name;
    // 构造函数内部的this上定义的实例方法
    this.say=function(){
        console.log(`${this.name} say hello`);
    }
}

// 在构造函数上定义的静态方法
Student.eat=function(){
    console.log('i can eat something');
}
// 在构造函数原型对象上定义的原型方法
Student.prototype.run=function(){
    console.log('i like running');
}

let s=new Student('xiao');
// 在实例上定义的实例方法
s.sing=function(){
    console.log('i like singing');
}

// 实例方法
s.say();
// 实例方法
s.sing();
// 静态方法
Student.eat();

// s.eat();//报错，实例对象不能
// 原型方法
s.run();
// 通过构造函数访问原型方法
Student.prototype.run();

/**
 * ES5和ES6中静态属性和静态方法声明区别
 */
class Teacher{
    constructor(sex){
        this.sex=sex;
    }

    // 使用static声明静态方法
    static printSex(){
        console.log('this is printSexMethod');
    }

}

// 静态属性只能通过类.属性名声明
Teacher.age=20;
// 通过类.方法名来声明静态方法
Teacher.talk=()=>{
    console.log('i like talk');
}

console.log('age',Teacher.age);
Teacher.printSex();
Teacher.talk();

/**
 * 静态属性和静态方法的使用场景：单例模式
 */




