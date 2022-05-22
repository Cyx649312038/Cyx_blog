// {
//     // a未声明
//   if (typeof a === "undefined") {
//           console.log( "cool" );
//       }
//   // b声明了，但还处于TDZ
//   if (typeof b === "undefined") { // ReferenceError!
//   // .. 
// }
//   // ..
//   let b;
 
// }


// let foo = []
// for(let i = 0; i < 5; i++) {
//     foo.push(function() {
//         console.log('i',i);
//     })
// }
// foo[3]();

// var funcs = [];
// for (var i = 0; i < 5; i++) {
//     // let j = i;
//     funcs.push( function(){
//         console.log( i );
// } ); }
// funcs[3]();    // 5

// var funcs = [];
// for (var i = 0; i < 5; i++) {
//     let j = i;
//     funcs.push( function(){
//         console.log( j);
// } ); }
// funcs[3]();    // 3


// {
//     // foo()
//     function foo() {
//         console.log('块内函数');
//     }
// }
// foo()


// function foo(x,y,...z) {
//     console.log(x,y,z);
// }
// foo(1,2,3,4,5,6) //1 2 [ 3, 4, 5, 6 ]
// foo(1,2,[3,4,5]) //1 2 [ [ 3, 4, 5 ] ]


// var a = [1,2,3,4]
// console.log(1 in a);

// function foo(x = 11, y = 31) {
//     console.log( x + y );
// }
// foo(null, 1) // 1



// var w = 1, z = 2;
// function foo( x = w + 1, y = x + 1, z = z + 1 ) {
//     console.log( x, y, z );
// }
// foo();                   // ReferenceError


// var {a: X, a: { x: Y, y: Z } } = {a : {x: 1, y: 2}}
// console.log(X, Y, Z); //{ x: 1, y: 2 } 1 2

// var {a: X, a: Y, a: [Z]} = {a: [1]}
// console.log(X,Y,Z); //[ 1 ] [ 1 ] 1


// var o = {a: 1, b: 2, c: 3}, a,b,c
// var p = {a,b,c} = o
// console.log(p, p === o);


// var a = [1,2,3]
// var [c,...d] = a
// console.log(c,d); //1 [ 2, 3 ]

// function test() {
//     y = 2
// }
// console.log(y);  y is not defined


// var obj = {
//     a: 1,
//     something(x,y) {
//         if(x > y) {
//             return something(y,x)
//         }
//     }
// }
// obj.something(3,1) //ReferenceError: something is not defined


// var o1 = {
//     foo() {
//         console.log('o1.foo');
//     }
// }

// var o2 = {
//     foo() {
//         super.foo()
//         console.log('o2.foo');
//     }
// }

// Object.setPrototypeOf(o2,o1)
// o2.foo()  //o1.foo  o2.foo


// function foo(strings, ...values) {
//     console.log(strings);
//     console.log(values);
// }

// var desc = "awesome";
// foo`Everything is ${desc}!`;
// //[ 'Everything is ', '!' ]
// //[ 'awesome' ]


// var obj = {
//     f1: () => {
//         // console.log(this);
//         return this
//     }
// }
// obj.f1() // {}
// console.log(module.exports === this );  //true


// var dec = 42,
//     oct = 052, //42
//     hex = 0x2a //42
// console.log(dec, oct, hex);

// // es6
// var oct2 = 0o52 //42
// console.log(oct2);

// var a = 42
// console.log(a.toString(8));
// console.log(a.toString(16));
// console.log(a.toString(2));


// var sy1 = Symbol('test')
// var obj = {
//     sy1: 'symbol测试'
// }
// console.log(obj.sy1, obj['sy1']);

// function HappyFace() {
//     const INSTANCE = Symbol.for( "instance" );
//     if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];
//     function smile() { 

//      }
//     return HappyFace[INSTANCE] = {
//         smile: smile
// }; }
// var me = HappyFace(),
// you = HappyFace();
// console.log(me === you); //true


var s = Symbol.for('test')
console.log(s);//Symbol(test)
var dec = Symbol.keyFor(s)
console.log(dec); // 'test'
// 再次从注册中取得符号
var s2 = Symbol.for( dec );
console.log(s === s2);   // true



