console.log({
    a:111
}.toString, true.toString(), [1,2,3].toString());
// let a = null
// let b = undefined
// console.log(a.toString(), b.toString());

console.log(JSON.stringify(null),JSON.stringify(undefined),JSON.stringify(true),);
console.log(JSON.stringify(function() {}));
console.log(JSON.stringify([1,undefined,function(){},4,null]));
console.log(JSON.stringify({a:2, b: function(){}}));

console.log(new Boolean(false) && new Boolean(0) && new Boolean(null));

var a = 42
var b = String(a)
console.log(typeof b);
var c = '42'
var d = Number(c)
console.log(typeof d);

var e = 3 + +'4'
console.log(e); //7

console.log(new Date().getTime(), Date.now());

var f = 'hello'
console.log(~f.indexOf('el')); //-2
console.log(~f.indexOf('ol')); //0

console.log(parseInt('42px')); //42
console.log(parseInt(42.11)); //42
console.log(parseInt(1/0)); //NaN
console.log(parseInt(1/0, 19)); //18

var n1 = [1,2]
var n2 = [3,4]
console.log(n1.valueOf);
console.log(n1 + n2); // 1,23,4

console.log(42 || 'a');
console.log(42 && 'a');

console.log(NaN === NaN);
console.log(-0 === +0);

console.log({a: '111'}.toString());

console.log(new String('abc').toString()); //abc

console.log(0 == [], [].valueOf(), [].toString()); //true
console.log({}.toString(),{}.valueOf());