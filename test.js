class lazyMan{
  name = ''
  stack = []
  constructor(name){
    this.name = name
    setTimeout(() => {
      this.next()
    })
  }
  next(){
    const task = this.stack.shift()
    if(task) task()
  }
  eat(food){
    const task = () => {
      console.info(`${this.name}eat${food}`)
      this.next()
    }
    this.stack.push(task)
    return this
  }
  sleep(second) {
    const task = () => {
      setTimeout(() => {
        console.info(`等待${second}秒,执行下一个任务`)
        this.next()
      }, second)
    }
    this.stack.push(task)
    return this
  }
}
let me = new lazyMan('nexus')
me.eat('1').eat('2').sleep(2000).eat('3')