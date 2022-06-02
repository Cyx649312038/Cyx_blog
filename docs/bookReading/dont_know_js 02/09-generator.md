## 打破完整运行
```js
var x = 1
function *foo() {
    x++;
    yield;
    console.log('x:', x);
}
function bar() {
    x++
}

var it = foo()  //构造一个迭代器it来控制这个生成器*foo()
it.next()
console.log(x); //2
bar()
console.log(x); //3
it.next()      // x: 3
```
(1)it = foo()运算并没有执行生成器*foo()，而只是构造了一个迭代器(iterator)，这个 迭代器会控制它的执行。后面会介绍迭代器。

(2) 第一个 it.next() 启动了生成器 *foo()，并运行了 *foo() 第一行的 x++。

(3) *foo() 在 yield 语句处暂停，在这一点上第一个 it.next() 调用结束。此时 *foo() 仍
 在运行并且是活跃的，但处于暂停状态。

(4) 我们查看 x 的值，此时为 2。

(5) 我们调用 bar()，它通过 x++ 再次递增 x。

(6) 我们再次查看 x 的值，此时为 3。

(7) 最后的 it.next() 调用从暂停处恢复了生成器 *foo() 的执行，并运行 console.log(..)
语句，这条语句使用当前 x 的值 3。

显然，foo() 启动了，但是没有完整运行，它在 yield 处暂停了。后面恢复了 foo() 并让它
运行到结束，但这不是必需的。

因此，生成器就是一类特殊的函数，可以一次或多次启动和停止，并不一定非得要完成。 尽管现在还不是特别清楚它的强大之处，但随着对本章后续内容的深入学习，我们会看到 它将成为用于构建以生成器作为异步流程控制的代码模式的基础构件之一。

### 输入与输出
```js
function *foo(x) {
    var y = x * (yield);
    return y;
}
var it = foo( 6 );
// 启动foo(..) 
it.next();
var res = it.next( 7 );
res.value;     // 42
```
首先，传入 6 作为参数 x。然后调用 it.next()，这会启动 *foo(..)。
在*foo(..)内部，开始执行语句var y = x ..，但随后就遇到了一个yield表达式。它 就会在这一点上暂停 *foo(..)(在赋值语句中间!)，并在本质上要求调用代码为 yield 表达式提供一个结果值。接下来，调用it.next( 7 )，这一句把值7传回作为被暂停的 yield 表达式的结果。所以，这时赋值语句实际上就是var y = 6 * 7。现在，return y返回值42作为调用 it.next( 7 ) 的结果。

消息是双向传递的——yield.. 作为一个 表达式可以发出消息响应 next(..) 调用，next(..) 也可以向暂停的 yield 表达式发送值。

```js
function *foo(x) {
    var y = x * (yield 'hello')
    return y
}

var it = foo(6)
var res = it.next()
console.log(res.value); //hello
var res2 = it.next(2)
console.log(res2.value); //12
```
如果你的生成器中没有 return 的话——在生成器中和在普通函数中一样，return 当然不 是必需的——总有一个假定的/隐式的return;(也就是return undefined;)，它会在默认 情况下回答最后的 it.next(2) 调用提出的问题。

## 多个迭代器
```js
function *foo() {
    var x = yield 2
    z++
    var y = yield (x * z)
    console.log(x,y,z);
}

var z = 1

var it1 = foo()
var it2 = foo()
var val1 = it1.next().value
var val2 = it2.next().value
console.log(val1,val2);  // 2  2
var val1 = it1.next(val2 * 10).value //将值传递给暂停处的yield并继续运行直到下一个yield
var val2 = it2.next(val1 * 5).value //将值传递给暂停处的yield并继续运行直到下一个yield
console.log(val1,val2);  // 40  600 
it1.next(val2/2)  // 20 300 3
it2.next(val1/4)  // 200 10 3
```

## 生成器产生值

### 生产者与迭代器
```js
var something = (function() {
    var nextVal
    return {
        // for...of循环需要这个
        //将 something 的值(迭代器 something 的接口)也构建成为一 个 iterable。现在它既是 iterable，也是迭代器。
        [Symbol.iterator]:function() {return this},
        // 标准迭代器接口方法
        next: function() {
            if(nextVal === undefined) {
                nextVal = 1
            } else {
                nextVal = (3 * nextVal)
            }
            return {
                done: false,
                value: nextVal
            }
        }


    }
})()
console.log(something.next().value);
console.log(something.next().value);
console.log(something.next().value);
```
ES6 还新增了一个 for..of 循环，这意味着可以通过原生循环语法自动迭代标准迭代器:
```js
//for..of 循环期望 something 是 iterable，于是它寻找并调用它的 Symbol.iterator 函数。 我们将这个函数定义为就是简单的 return this，也就是把自身返回，而 for..of 循环并 不知情。
for(var v of something) {
    console.log(v);
    if(v > 500) {
        break
    }
}
```
:::tip
for..of 循环在每次迭代中自动调用 next()，它不会向 next() 传入任何值，并且会在接收 到 done:true 之后自动停止。这对于在一组数据上循环很方便。
:::

除了构造自己的迭代器，许多 JavaScript 的内建数据结构(从 ES6 开始)，比如 array，也 有默认的迭代器:
```js
var a = [1,3,5,7,9];
//for..of 循环向 a 请求它的迭代器，并自动使用这个迭代器迭代遍历 a 的值。
for (var v of a) {
    console.log( v );
}
// 1 3 5 7 9
```
:::tip
回顾一个之前的一个小知识:
Object.keys(..) 并不包含来自于 [[Prototype]] 链 上的属性，而 for..in 则包含(参见本系列的《你不知道的 JavaScript(上 卷)》的“this 和对象原型”部分)。
:::

### iterable
前面例子中的 something 对象叫作迭代器，因为它的接口中有一个 next() 方法。而与其紧
密相关的一个术语是 iterable(可迭代)，即指一个包含可以在其值上迭代的迭代器的对象。

从 ES6 开始，从一个 iterable 中提取迭代器的方法是:iterable 必须支持一个函数，其名称 是专门的 ES6 符号值 Symbol.iterator。调用这个函数时，它会返回一个迭代器。通常每 次调用会返回一个全新的迭代器，虽然这一点并不是必须的。

前面代码片段中的 a 就是一个 iterable。for..of 循环自动调用它的 Symbol.iterator 函数来 构建一个迭代器。我们当然也可以手工调用这个函数，然后使用它返回的迭代器:
```js
var a = [1,2,3,4,5]
var it = a[Symbol.iterator]()
console.log(it.next().value);
console.log(it.next().value);
console.log(it.next().value);
console.log(it.next().value);
console.log(it.next().value);
console.log(it.next().value);
```
### 生成器迭代器
严格说来，生成器本身并不是 iterable，尽管非常类似——当你执行一个生成器，就
得到了一个迭代器
可以通过生成器实现前面的这个 something 无限数字序列生产者，类似这样:
```js
function *something() {
    var nextVal;
    while (true) {
        if (nextVal === undefined) {
            nextVal = 1; }
        else {
            nextVal = (3 * nextVal) + 6;
        }
        yield nextVal;
    }
}


for (var v of something()) {
    console.log( v );
// 不要死循环! 
    if (v > 500) {
        break; 
    }
}

```
但是，不要忽略了这段 for (var v of something()) .. !我们并不是像前面的例子那样把 something 当作一个值来引用，而是调用了 *something() 生成器以得到它的迭代器供 for.. of 循环使用。

如果认真思考的话，你也许会从这段生成器与循环的交互中提出两个问题。

• 为什么不能用 for (var v of something) .. ?因为这里的 something 是生成器，并不是 iterable。我们需要调用 something() 来构造一个生产者供 for..of 循环迭代。

• something() 调用产生一个迭代器，但 for..of 循环需要的是一个 iterable，对吧?是 的。生成器的迭代器也有一个 Symbol.iterator 函数，基本上这个函数做的就是 return this，和我们前面定义的 iterable something 一样。换句话说，生成器的迭代器也是一个 iterable !

### 停止生成器
```js
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
//.....
//cleaning up
//buy buy
```
调用 it.return(..) 之后，它会立即终止生成器，这当然会运行 finally 语句。另外，它 还会把返回的value设置为传入return(..)的内容，这也就是"Hello World"被传出 去的过程。现在我们也不需要包含 break 语句了，因为生成器的迭代器已经被设置为 done:true，所以 for..of 循环会在下一个迭代终止。

## 异步迭代生成器
生成器与异步编码模式及解决回调问题等，有什么关系呢?让我们来回答这个重要的问题。

```js
function foo(x,y,cb) {
    ajax(
        "http://some.url.1/?x=" + x + "&y=" + y,
    cb );
}
foo( 11, 31, function(err,text) {
    if (err) {
        console.error( err );
    }
    else {
        console.log( text );
    } 
} );
```
如果想要通过生成器来表达同样的任务流程控制，可以这样实现:
```js
 function foo(x,y) {
    ajax(
        "http://some.url.1/?x=" + x + "&y=" + y,
        function(err,data){
            if (err) {
                // 向*main()抛出一个错误 
                it.throw( err );
            }
            else {
            // 用收到的data恢复*main()
                it.next( data );
            }
    } );
}
function *main() {
    try {
        var text = yield foo( 11, 31 );
        console.log( text );
    }
    catch (err) {
        console.error( err );
    } 
}
var it = main();
// 这里启动!
it.next();
```
们在生成器内部有了看似完全同步的代码(除了 yield 关键字本身)，但隐藏在背后的是，在 foo(..) 内的运行可以完全异步。

## 同步错误处理
让我们把注意力转移到生成器内 部的 try..catch:
```js
    try {
        var text = yield foo( 11, 31 );
        console.log( text );
    }
    catch (err) {
        console.error( err );
    } 
```
难道 try..catch 不是无法捕获异步错 误，就像我们在第 3 章中看到的一样吗?

精彩的部分在于 yield 暂停也使得生成器能够捕获错误。通过这段前面列出的 代码把错误抛出到生成器中
```js
if (err) {
    // 向*main()抛出一个错误 
    it.throw( err );
}
```
我们可以把错误抛入生成器中，不过如果是从生成器向外抛出错误呢?
```js
function *main() {
    var x = yield "hello"
    yield x.toLowerCase()
}
var it = main()
try {
    it.next()
    it.next(11)
} catch(err) {
    console.log('error',err);
}
```
甚至可以捕获通过 throw(..) 抛入生成器的同一个错误，基本上也就是给生成器一个处理 它的机会;如果没有处理的话，迭代器代码就必须处理:
```js
function *main2() {
    try {
        var x = yield "hello"
        console.log(x);
    } catch(err) {
        console.log('生成器内捕获错误', err);
    }
    
}
var it2 = main2()
try {
    it2.next()
    it2.throw("抛出错误！")
}catch(err) {
    console.log('error2', err);
}
```

## 生成器+Promise
```js
function run(gen) {
    var args = [].slice.call( arguments, 1), it;
    // 在当前上下文中初始化生成器 
    it = gen.apply( this, args );
    // 返回一个promise用于生成器完成 
    return Promise.resolve()
    .then( function handleNext(value){ // 对下一个yield出的值运行
        console.log('value', value);
        var next = it.next( value );
        console.log('var next = it.next( value );',next);
        return (function handleResult(next){ // 生成器运行完毕了吗?
            if (next.done){
                return next.value;
            }
            // 否则继续运行 
            else {
                return Promise.resolve( next.value )  //而如果向 Promise.resolve(..) 传递一个真正的 Promise，就只会返回同一个 promise:
                .then(
            // 成功就恢复异步循环，把决议的值发回生成器 
                handleNext,
            // 如果value是被拒绝的 promise， // 就把错误传回生成器进行出错处理 
                function handleErr(err) {
                        return Promise.resolve(
                        it.throw( err )
                        )
                        .then( handleResult );
                    }
            ); }
        })(next);
        } );
}

function foo(x,y) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve.bind(this,'接口调用完毕'),1000)
    })
}

function *main() {
    try {
        var text = yield foo();
        console.log( text );
    }
    catch (err) {
        console.error( err );
    } 
}

run(main)

```
### 生成器中的Promise并发
想象这样一个场景:你需要从两个不同的来源获取数据，然后把响应组合在一起以形成第 三个请求，最终把最后一条响应打印出来。
```js
  function *foo() {
        var r1 = yield request( "http://some.url.1" );
        var r2 = yield request( "http://some.url.2" );
        var r3 = yield request("http://some.url.3/?v=" + r1 + "," + r2);
        console.log( r3 );
     }
// 使用前面定义的工具run(..) 
run( foo );

```
因为请求 r1 和 r2 能够——出于性能考虑也应该——并发执行，但是在这段代码中， 它们是依次执行的.如何通过生成器和 yield 实现这一点呢?

```js
function *foo() {
    // 让两个请求"并行"
    var p1 = request( "http://some.url.1" ); 
    var p2 = request( "http://some.url.2" );
    // 等待两个promise都决议 
    var r1 = yield p1;
    var r2 = yield p2;
    var r3 = yield request("http://some.url.3/?v=" + r1 + "," + r2);
    console.log( r3 );
}
// 使用前面定义的工具run(..) 
run( foo );
```
进一步改进
```js

function *foo() {
// 让两个请求"并行"，并等待两个promise都决议 
    var results = yield Promise.all( [
    request( "http://some.url.1" ),
    request( "http://some.url.2" )
    ] );
    var r1 = results[0];
    var r2 = results[1];
    var r3 = yield request("http://some.url.3/?v=" + r1 + "," + r2);
    console.log( r3 );
}
// 使用前面定义的工具run(..) run( foo );

```
隐藏promise 进一步优化，并体会一些工具设计的抽象思想
```js
// 注:普通函数，不是生成器 
function bar(url1,url2) { return Promise.all( [
    request( url1 ),
    request( url2 )
    ] );
}
function *foo() {
// 隐藏bar(..)内部基于Promise的并发细节 
var results = yield bar(
    "http://some.url.1",
    "http://some.url.2"
);
var r1 = results[0];
var r2 = results[1];
var r3 = yield request("http://some.url.3/?v=" + r1 + "," + r2);
console.log( r3 );
}
// 使用前面定义的工具run(..) 
run( foo );
```
在 *foo() 内部，我们所做的一切就是要求 bar(..) 给我们一些 results，并通过 yield 来等待结果，这样更简洁也更清晰。我们不需要关心在底层是用Promise.all([ .. ]) Promise 组合来实现这一切。

我们把异步，实际上是 Promise，作为一个实现细节看待。

如果想要实现一系列高级流程控制的话，那么非常有用的做法是:把你的 Promise 逻辑隐藏在一个只从生成器代码中调用的函数内部。比如:

有时候会需要这种逻辑，而如果把它直接放在生成器内部的话，那你就失去了几乎所有一 开始使用生成器的理由。应该有意将这样的细节从生成器代码中抽象出来，以避免它把高 层次的任务表达变得杂乱。创建代码除了要实现功能和保持性能之外，你还应该尽可能使代码易于理解和维护。

## 生成器委托
```js
function *foo() {
    console.log('foo start');
    yield 3
    yield 4
    console.log('foo ending');
}

function *bar() {
    yield 1
    yield 2
    yield *foo()
    yield 5
}

var it = bar()
console.log(it.next().value); //1
console.log(it.next().value);  //2
console.log(it.next().value);  //'foo start' 3
console.log(it.next().value); //4
console.log(it.next().value); // 'foo ending' 5
```
首先，和我们以前看到的完全一样，调用foo()创建一个迭代器。然后yield *把迭代器实例控制(当前 *bar() 生成器的)委托给 / 转移到了这另一个 *foo() 迭代器。

所以，前面两个 it.next() 调用控制的是 *bar()。但当我们发出第三个 it.next() 调用时， *foo() 现在启动了，我们现在控制的是 *foo() 而不是 *bar()。这也是为什么这被称为委 托:*bar() 把自己的迭代控制委托给了 *foo()。
一旦 it 迭代器控制消耗了整个 *foo() 迭代器，it 就会自动转回控制 *bar()。

```js
 function *foo() {
    var r2 = yield request( "http://some.url.2" );
    var r3 = yield request( "http://some.url.3/?v=" + r2 );
    return r3; 
}
function *bar() {
    var r1 = yield request( "http://some.url.1" );
    // 通过 yeild* "委托"给*foo() 
    var r3 = yield *foo();
    console.log( r3 );
}
run( bar );
```
:::tip
yield *暂停了迭代控制，而不是生成器控制。当你调用*foo()生成器 时，现在 yield 委托到了它的迭代器。但实际上，你可以 yield 委托到任意 iterable，yield *[1,2,3] 会消耗数组值 [1,2,3] 的默认迭代器。
:::

### 消息委托
```js

function *foo() {
    console.log( "inside *foo():", yield "B" );
    console.log( "inside *foo():", yield "C" );
    return "D"; 
}
function *bar() {
    console.log( "inside *bar():", yield "A" );
    // yield委托!
    console.log( "inside *bar():", yield *foo() );
    console.log( "inside *bar():", yield "E" );
    return "F";
}
var it = bar();
console.log( "outside:", it.next().value );
// outside: A
console.log( "outside:", it.next( 1 ).value );
// inside *bar(): 1
// outside: B
console.log( "outside:", it.next( 2 ).value );
// inside *foo(): 2
// outside: C
console.log( "outside:", it.next( 3 ).value );  //3 传给yield C 的yeild 然后接着往下走到return ‘D’ 之后D作为yield *foo(）yeild 的值接着往下走
// inside *foo(): 3
// inside *bar(): D
// outside: E
console.log( "outside:", it.next( 4 ).value );
// inside *bar(): 4
// outside: F
```
要特别注意 it.next(3) 调用之后的执行步骤。

(1) 值 3(通过 *bar() 内部的 yield 委托)传入等待的 *foo() 内部的 yield "C" 表达式。 

(2) 然后 *foo() 调用 return "D"，但是这个值并没有一直返回到外部的 it.next(3) 调用。 

(3) 取而代之的是，值 "D" 作为 *bar() 内部等待的 yield*foo() 表达式的结果发出——这个
yield 委托本质上在所有的 *foo() 完成之前是暂停的。所以 "D" 成为 *bar() 内部的最
后结果，并被打印出来。

(4) yield "E" 在 *bar() 内部调用，值 "E" 作为 it.next(3) 调用的结果被 yield 发出。

异常也被委托!和 yield 委托透明地双向传递消息的方式一样，错误和异常也是双向传递的:

```js
function *foo() {
    try {
        yield "B"; 
    }
    catch (err) {
        console.log( "error caught inside *foo():", err );
    }
    yield "C";
    throw "D";
}
function *bar() {
    yield "A";
    try {
        yield *foo();
    }
    catch (err) {
        console.log( "error caught inside *bar():", err );
    }
    yield "E";
    yield *baz();
    // 注:不会到达这里!
    yield "G"; 
}
function *baz() {
    throw "F";
}
var it = bar();
console.log( "outside:", it.next().value );
// outside: A
console.log( "outside:", it.next( 1 ).value );
// outside: B
console.log( "outside:", it.throw( 2 ).value );
// error caught inside *foo(): 2
// outside: C
console.log( "outside:", it.next( 3 ).value );
// error caught inside *bar(): D
// outside: E
try {
    console.log( "outside:", it.next( 4 ).value );
}
catch (err) {
    console.log( "error caught outside:", err );
}
// error caught outside: F
```

## 形实转换程序(thunk)
形实转换程序的一个狭义表述: JavaScript 中的 thunk 是指一个用于调用另外一个函数的函数，没有任何参数。

换句话说，你用一个函数定义封装函数调用，包括需要的任何参数，来定义这个调用的执 行，那么这个封装函数就是一个形实转换程序。之后在执行这个 thunk 时，最终就是调用 了原始的函数。

```js
function foo(x,y) {
    console.log(x+y);
}

function foothunk() {
    return foo(3,4)
}

foothunk()
```

所以，同步的 thunk 是非常简单的。但如果是异步的 thunk 呢?我们可以把这个狭窄的 thunk 定义扩展到包含让它接收一个回调。

```js
 function foo(x,y,cb) {
    setTimeout( function(){
        cb( x + y );
    }, 1000 );
}
function fooThunk(cb) {
    foo( 3, 4, cb );
}
// 将来
fooThunk( function(sum){
    console.log( sum );
} );
```

## es6之前实现生成器
如何在es6之前实现生成器呢，体会下面代码，可以帮助我们更好的理解生成器工作原理

### 手工变换
```js
function foo(url) { // 管理生成器状态 
    var state;
    // 生成器变量范围声明
     var val;
    function process(v) {
        switch (state) {
            case 1:
                console.log( "requesting:", url );
                return request( url );
            case 2:
                val = v;
                console.log( val );
                return;
            case 3:
                var err = v;
                console.log( "Oops:", err );
                return false;
        }
    }
    // 构造并返回一个生成器 
    return {
        next: function(v) { // 初始状态
            if (!state) {
                state = 1;
                return {
                    done: false,
                    value: process()
                };
            }
            // yield成功恢复
            else if (state == 1) {

                state = 2;
                return {
                    done: true,
                    value: process( v )
                };
            }
            // 生成器已经完成 
            else {
                return {
                    done: true,
                    value: undefined
                };
            } 
        },
        "throw": function(e) {
        // 唯一的显式错误处理在状态1 
        if (state == 1) {
            state = 3;
            return {
                done: true,
                value: process( e )
            };
        }
        // 否则错误就不会处理，所以只把它抛回 
        else {
        throw e; 
        }
        } 
    };
}
              
var it = foo('url1')
var val1 = it.next()
val1.then(function(val) {
    it.next(val)
})
```
### 自动转换

