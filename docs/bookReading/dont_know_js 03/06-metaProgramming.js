// function foo() {

// }
// console.log(foo.name); //foo

// var bar = function() {

// }
// console.log(bar.name); //bar

// var fn1 = function fn2() {

// }
// console.log(fn1.name); //fn2


// var obj = { a: 1,b:2 },
// handlers = {
//     get(target,key,context) {
//         // 注意:target === obj,
//         // context === pobj
//         console.log( "accessing: ", key );
//         return Reflect.get(
//             target, key, context
//         );
//         // return target['b']
//     } 
// },
// pobj = new Proxy( obj, handlers );
// obj.a; // 1
// pobj.a; // accessing: a
//         // 1
// // console.log(obj.a); //1
// // console.log(pobj.a); //accessing:  a
//                         //2


// var obj = {a: 1},
// handlers = {
//     get(target, key,context) {
//         console.log('代理trap函数执行', key);
//         return target[key]
//     }
// },
// {proxy: pobj, revoke: prevoke} = Proxy.revocable(obj, handlers)
// console.log(obj.a); //1
// console.log(pobj.a); //代理trap函数执行 a
//                      //1       
// // 关闭代理
// prevoke()
// console.log(pobj.a); //TypeError: Cannot perform 'get' on a proxy that has been revoked

// var obj = {
//     a: 1,
//     foo() {
//         console.log('a: ', this.a);
//     }
// }
// var handlers = {
//     get(target, key, context) {
//         if(Reflect.has(target, key)) {
//             return Reflect.get(target, key, context)
//         }else {
//             throw "No such property/method!"
//         }
//     },
//     set(target, key, val, context) {
//         if(Reflect.has(target, key)) {
//             return Reflect.set(target, key, val, context)
//         } else {
//             throw "No such property/method!"
//         }
//     }
// }
// var pobj = new Proxy(obj, handlers)
// console.log(pobj.a); //1
// pobj.foo() //a: 1
// console.log(pobj.b); //throw "No such property/method!"


// console.log(Reflect.ownKeys({a:1}));


// try {
//     (){}

// }catch(err) {
//     // 到不了这前面编译都过不了
//     console.log(err);

// }
// try {
//     // eval("(){}") 
//     new Function("(){}")
// } catch(err) {
//     console.log('error',err); //这样可以到这
// }


"use strict";
var foo = (function(){
    function _foo(acc,x) {
        if (x <= 1) return acc;
        return _foo( (x / 2) + acc, x - 1 );
    }
    return function(x) {
        return _foo( 1, x );
    }; 
})();
foo( 123456 ); // 3810376848.5
