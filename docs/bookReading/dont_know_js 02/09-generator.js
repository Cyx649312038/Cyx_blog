// var x = 1
// function *foo() {
//     x++;
//     yield;
//     console.log('x:', x);
// }
// function bar() {
//     x++
// }

// var it = foo()  //构造一个迭代器it来控制这个生成器*foo()
// it.next()
// console.log(x); //2
// bar()
// console.log(x); //3
// it.next()      // x: 3


// function *foo(x) {
//     var y = x * (yield 'hello')
//     return y
// }

// var it = foo(6)
// var res = it.next()
// console.log(res.value); //hello
// var res2 = it.next(2)
// console.log(res2.value); //12

// function *foo() {
//     var x = yield 2
//     z++
//     var y = yield (x * z)
//     console.log(x,y,z);
// }


// var z = 1

// var it1 = foo()
// var it2 = foo()
// var val1 = it1.next().value
// var val2 = it2.next().value
// console.log(val1,val2);  // 2  2
// var val1 = it1.next(val2 * 10).value //将值传递给暂停处的yield并继续运行直到下一个yield
// var val2 = it2.next(val1 * 5).value //将值传递给暂停处的yield并继续运行直到下一个yield
// console.log(val1,val2);  // 40  600 
// it1.next(val2/2)  // 20 300 3
// it2.next(val1/4)  // 200 10 3


// var gimmeSomething = (function(){
//     var nextVal;
//     return function(){
//         if (nextVal === undefined) {
//             nextVal = 1; 
//         }
//         else {
//             nextVal = (3 * nextVal) +6;
//         }
//         return nextVal;
//         };
// })();
// console.log(gimmeSomething()); 
// console.log(gimmeSomething());
// console.log(gimmeSomething());


// var something = (function() {
//     var nextVal
//     return {
//         // for...of循环需要这个
//         [Symbol.iterator]:function() {return this},
//         // 标准迭代器接口方法
//         next: function() {
//             if(nextVal === undefined) {
//                 nextVal = 1
//             } else {
//                 nextVal = (3 * nextVal)
//             }
//             return {
//                 done: false,
//                 value: nextVal
//             }
//         }


//     }
// })()
// console.log(something.next().value);
// console.log(something.next().value);
// console.log(something.next().value);

// for(var v of something) {
//     console.log(v);
//     if(v > 500) {
//         break
//     }
// }

// var a = [1,2,3,4,5]
// var it = a[Symbol.iterator]()
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);
// console.log(it.next().value);


function *something() {
    try{
        var nextVal;
        while (true) {
            if (nextVal === undefined) {
                nextVal = 1; }
            else {
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    } finally {
        console.log('cleaning up');
    }
    
}

// for(var k of something()) {
//     console.log(k);
//     if(k >500) {
//         break
//     }
// }
var it = something()
for(var k of it) {
    console.log(k);
    if(k >500) {
        console.log(it.return('buy buy').value)
    }
}







