const arr = [1,2,3,4]
console.log(arr);
console.log(Object.prototype.toString.call(arr));

var a = new String('abc')
var bool = new Boolean(false)
console.log(a,bool);
console.log(a.valueOf(),bool.valueOf());