class A{
  a(){
    console.log('a')
  }
}
A.prototype.b = function(){}

let a = new A()
for(let key in a) {
  console.log(key)
}