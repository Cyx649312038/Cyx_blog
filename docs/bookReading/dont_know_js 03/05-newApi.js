// var arr = Array(3)
// console.log(arr.length,arr[2]); //3 undefined

// var arr2 = Array.of(3)
// console.log(arr2.length, arr2[0]); //1 3


// var arrLike = {
//     length: 3,
//     0: 'foo',
//     1: 'bar'
// }
// var arr = Array.prototype.slice.call(arrLike)
// console.log(arr); //[ 'foo', 'bar', <1 empty item> ]

// var arr2 = arr.slice()  
// console.log(arr2, arr === arr2); //[ 'foo', 'bar', <1 empty item> ]   false

// var arr3 = Array.from(arrLike)
// console.log(arr3);  //[ 'foo', 'bar', undefined ]

// var arr4 = Array.from(arr3)
// console.log(arr3, arr3 === arr4);  //[ 'foo', 'bar', undefined ]   false


// var arr = []
// arr.length = 5
// arr[2] = 'wq'
// console.log(arr);  //[ <2 empty items>, 'wq', <2 empty items> ]
// arr.forEach(item => console.log(item)) //wq
// var arr2 = Array.from(arr)
// arr2.forEach(item => console.log(item)) //undefined undefined wq undefined undefined


// var arr3 = Array.from({length: 4})
// console.log(arr3); //[ undefined, undefined, undefined, undefined ]


// var o = {
//     a: 1,
//     [Symbol('bar')]: 'cyx',
//     b: 2
// }
// console.log(Object.getOwnPropertySymbols(o));  //[ Symbol(bar) ]


// var o1 = {
//     foo() {
//         console.log('o1->foo');
//     }
// }

// var o2 = {}
// Object.setPrototypeOf(o2, o1)
// o2.foo() //o1->foo
// console.log(o2.__proto__);  //{ foo: [Function: foo] }


