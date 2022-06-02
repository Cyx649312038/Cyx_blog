// var arr = [1,2,3,4]
// var it = arr[Symbol.iterator]()
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// // { value: 1, done: false }
// // { value: 2, done: false }
// // { value: 3, done: false }
// // { value: 4, done: false }
// // { value: undefined, done: true }

// var str = 'cyxtest'
// var it2 = str[Symbol.iterator]()
// console.log(it2.next());
// console.log(it2.next());
// // { value: 'c', done: false }
// // { value: 'y', done: false }
// // ...


// var Fib = {
//     [Symbol.iterator]() {
//     var n1 = 1, n2 = 1;
//     return {
//         // 使迭代器成为iterable 
//         [Symbol.iterator]() { return this; },
//         next() {
//             var current = n2;
//             n2 = n1;
//             n1 = n1 + current;
//             return { value: current, done: false };
//         },
//         return(v) {
//             console.log(
//                 "Fibonacci sequence abandoned."
//             );
//             return { value: v, done: true };
//         }
//     }; 
//     }
// };
// for (var v of Fib) {
//     console.log( v );
//     if (v > 50) break;
// }
// // 1 1 2 3 5 8 13 21 34 55
// // Fibonacci sequence abandoned.

// var something = (function() {
//     var nextVal
//     return {
//         // for...of循环需要这个
//         //将 something 的值(迭代器 something 的接口)也构建成为一 个 iterable。现在它既是 iterable，也是迭代器。
//         [Symbol.iterator]:function() {return this},
//         // 标准迭代器接口方法
//         next: function() {
//             if(nextVal === undefined) {
//                 nextVal = 1
//             } else {
//                 nextVal = (3 * nextVal)
//             }
//             if(nextVal > 500 ) {
//                 return {
//                     done: true,
//                     value: nextVal
//                 }
//             }
//             return {
//                 done: false,
//                 value: nextVal
//             }
//         }


//     }
// })()

// for(var v of something) {
//     console.log(v);
// }


// function MyObj(a,b,d) {
//     this.a = a
//     this.b = b
//     this[Symbol('d')] = d  //Symbol属性（不可枚举
// }

// MyObj.prototype.c = 'c'

// var obj = new MyObj('a', 'b', 'd')
// console.log('obj', obj);
// for(var k in obj) {
//     console.log(k); // a  b  c
// }


// import c, {b} from './02-codeOrganization2.js'
// console.log('a',a,'c',c,'b',b);  // a 1   b 4  c 5

import * as myImport from './02-codeOrganization2.js'
console.log(myImport.a, myImport.b,myImport.c, myImport.default); //1 2 { name: 'cyx' } 3
// myImport.a = 2    TypeError: Cannot assign to read only property 'a' of object '[object Module]'