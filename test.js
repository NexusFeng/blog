Function.prototype._bind = function (context,...outsideArgs) {
  context = (context !== undefined && context !== null) ? context : window
  let fn = Symbol()
  context[fn] = this
  let outsideThis = this
  const res = function(...innerArgs) {
    let innerThis = this
    if(innerThis instanceof outsideThis) {
      innerThis[fn] = outsideThis
      return innerThis[fn](...[...innerArgs, ...outsideArgs])
    }
    return context[fn](...[...innerArgs, ...outsideArgs])
  }
  if(res.prototype) res.prototype = Object.create(this.prototype)
  return res
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};


var emptyObj = {};
var YAxisPoint = Point._bind(emptyObj, 0);
var axisPoint = new YAxisPoint(5);
console.log(axisPoint.toString())// 5,0

