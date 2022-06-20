function changeArg(x) {
  if (typeof x === 'object') {
    x.name = 'a';
  } else {
    x = 200;
  }
}

let num = 100;
changeArg(num);
console.log('changeA', num);
let obj = { name: 's' };
changeArg(obj);
console.log('obj', obj);
let obj1 = { city: 's' };
changeArg(obj1);
console.log('obj1', obj1);