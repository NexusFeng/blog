class Add1 {
  constructor(){
    this.tasks = []
  }
  add(){
    this.tasks.push(1)
  }
  del() {
    this.tasks.shift()
  }
}
class Add2 {
  constructor(){
    this.tasks = []
    this.perTask = []
  }
  add(){
    this.tasks.push(1)
  }
  del() {
    while(this.tasks.length) {
      this.perTask.push(this.tasks.pop())
    }
    this.perTask.pop()
  }
}

console.time('add1')
let add1 = new Add1()
for(let i = 0; i < 10000; i ++) {
  add1.add()
}
add1.del()
console.timeEnd('add1')


console.time('add2')
let add2 = new Add2()
for(let i = 0; i < 10000; i ++) {
  add2.add()
}
add2.del()
console.timeEnd('add2')
