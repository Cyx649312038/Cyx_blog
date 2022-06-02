// function *main() {
//     var x = yield "hello"
//     yield x.toLowerCase()
// }
// var it = main()
// try {
//     it.next()
//     it.next(11)
// } catch(err) {
//     console.log('error',err);
// }


// function *main2() {
//     try {
//         var x = yield "hello"
//         console.log(x);
//     } catch(err) {
//         console.log('生成器内捕获错误', err);
//     }
    
// }
// var it2 = main2()
// try {
//     it2.next()
//     it2.throw("抛出错误！")
// }catch(err) {
//     console.log('error2', err);
// }


// 在此感谢Benjamin Gruenbaum(@benjamingr on GitHub)的巨大改进! 
// function run(gen) {
//     var args = [].slice.call( arguments, 1), it;
//     // 在当前上下文中初始化生成器 
//     it = gen.apply( this, args );
//     // 返回一个promise用于生成器完成 
//     return Promise.resolve()
//     .then( function handleNext(value){ // 对下一个yield出的值运行
//         console.log('value', value);
//         var next = it.next( value );
//         console.log('var next = it.next( value );',next);
//         return (function handleResult(next){ // 生成器运行完毕了吗?
//             if (next.done){
//                 return next.value;
//             }
//             // 否则继续运行 
//             else {
//                 return Promise.resolve( next.value )  //而如果向 Promise.resolve(..) 传递一个真正的 Promise，就只会返回同一个 promise:
//                 .then(
//             // 成功就恢复异步循环，把决议的值发回生成器 
//                 handleNext,
//             // 如果value是被拒绝的 promise， // 就把错误传回生成器进行出错处理 
//                 function handleErr(err) {
//                         return Promise.resolve(
//                         it.throw( err )
//                         )
//                         .then( handleResult );
//                     }
//             ); }
//         })(next);
//         } );
// }

// function foo(x,y) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve.bind(this,'接口调用完毕'),1000)
//     })
// }

// function *main() {
//     try {
//         var text = yield foo();
//         console.log( text );
//     }
//     catch (err) {
//         console.error( err );
//     } 
// }

// run(main)


// function *foo() {
//     console.log('foo start');
//     yield 3
//     yield 4
//     console.log('foo ending');
// }

// function *bar() {
//     yield 1
//     yield 2
//     yield *foo()
//     yield 5
// }

// var it = bar()
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);


// function *foo() {
//     console.log( "inside *foo():", yield "B" );
//     console.log( "inside *foo():", yield "C" );
//     return "D"; 
// }
// function *bar() {
//     console.log( "inside *bar():", yield "A" );
//     // yield委托!
//     console.log( "inside *bar():", yield *foo() );
//     console.log( "inside *bar():", yield "E" );
//     return "F";
// }
// var it = bar();
// console.log( "outside:", it.next().value );
// // outside: A
// console.log( "outside:", it.next( 1 ).value );
// // inside *bar(): 1
// // outside: B
// console.log( "outside:", it.next( 2 ).value );
// // inside *foo(): 2
// // outside: C
// console.log( "outside:", it.next( 3 ).value );  //3 传给yield C 的yeild 然后接着往下走到return ‘D’ 之后D作为yield *foo(）yeild 的值接着往下走
// // inside *foo(): 3
// // inside *bar(): D
// // outside: E
// console.log( "outside:", it.next( 4 ).value );
// // inside *bar(): 4
// // outside: F


// var res = []
// function request(url) {
//    return new Promise((reslove, reject) => {
//         setTimeout(reslove.bind(this,'接口调用～'+url), 1000)
//     })
    
// }
// function *reqData(url) {
//     res.push(yield request(url))
// }

// var it1 = reqData( "http://some.url.1" );
// var it2 = reqData( "http://some.url.2" );
// var p1 = it1.next().value;
// var p2 = it2.next().value;
// console.log(p1,p2);
// p1
// .then( function(data){
//     it1.next( data );
//     return p2;
// })
// .then( function(data){
// it2.next( data );

// console.log('res' ,res);
// } );


function request(url) {
   return new Promise((reslove, reject) => {
        setTimeout(reslove.bind(this,'接口调用～'+url), 1000)
    })
    
}
var res = [];
function *reqData(url) {
    var data = yield request( url );
    // 控制转移
    //  yield;
    res.push( data );
}
var it1 = reqData( "http://some.url.1" );
var it2 = reqData( "http://some.url.2" );
var p1 = it1.next().value;
var p2 = it2.next().value;
console.log(p1,p2);
// p1.then( function(data){
//     it1.next( data );
// } );
// p2.then( function(data){
//     it2.next( data );
// } );
Promise.all( [p1,p2] )
.then( function(data){
    it1.next(data[0]);
    it2.next(data[1]);
    console.log('res', res);
} );
