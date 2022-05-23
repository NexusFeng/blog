// let map = new Map()

map.set("a", "a")
map.set("b", "b")
map.set(NaN, "c")

console.log(NaN == NaN)
console.log(map.get(NaN))

// console.log(map.__proto__.__proto__)
const tree = {
  val: "a",
  children: [
    {
      val: "b",
      children: [
        {
          val: "d",
          children: [],
        },
        {
          val: "e",
          children: [],
        },
      ],
    },
    {
      val: "c",
      children: [
        {
          val: "f",
          children: [],
        },
        {
          val: "g",
          children: [],
        },
      ],
    },
  ],
}

let arr = [],
  arr1 = [[1]]
let [l] = arr1.shift()
for (let i = 0; i < 5; i++) {
  arr.push(["a", l++])
}
console.log(arr)

let arr2 = [1, 2, 3]
console.log(arr2[4])
