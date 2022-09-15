let promise1 = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve()
  },1000)
})
let promise2 = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve()
  },2000)
})
let promise3 = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve()
  },3000)
})
let promise4 = new Promise((resolve,reject) => {
  setTimeout(() => {
    reject()
  },4000)
})
let arr = [promise1, promise2, promise3, promise4]
let arr1 = Promise.all(arr).then(() => {
  console.log('222')
}).catch(() => {
  console.log('333')
})
console.log(arr1, 'arr1')