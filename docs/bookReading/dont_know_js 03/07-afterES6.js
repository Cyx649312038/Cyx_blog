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

// console.log('run',run(main));


// async function request(url) {
//     var resp = await (
//         new Promise( function(resolve,reject){
//             var xhr = new XMLHttpRequest();
//             xhr.open( "GET", url );
//             xhr.onreadystatechange = function(){
//                 if (xhr.readyState == 4) {
//                     if (xhr.status == 200) {
//                         resolve( xhr );
//                     }
//                     else {
//                         reject( xhr.statusText );
//                     } 
//                 }
//             };
//             xhr.send(); 
//         })
//     );
//     return resp.responseText;
// }
// var pr = request( "http://some.url.1" );
// pr.then(
//     function fulfilled(responseText){
//     // ajax成功 
// },
// function rejected(reason){ //哎呀，出错了
// } );


// var obj = {a: 1, b: 2}

// Object.observe(
//     obj,
//     function(changes) {
//         console.log(changes);
//     }
//     ["add","update","delete"]
// )

// obj.c = 3


// var a = 2
// var b = a ** 3
// console.log(b); //8


var arr = [1,2,3,4]
console.log(arr.includes(2));  //true
 