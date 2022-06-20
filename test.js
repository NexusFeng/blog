function foo(el){
  console.log(el, this.id)
}
var obj = {
  id: 'awesome'
}; // 此处得加;
[1,2,3].forEach(foo, obj)