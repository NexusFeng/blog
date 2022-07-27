let obj = {a:1, b:2}
let a = 22
Object.defineProperty(obj, 'a',{
  get(){
    console.log(333)
    return a
  }
})
Object.defineProperty(obj, 'a',{
  get(){
    console.log(222)
    return a
  }
})
console.log(obj.a)