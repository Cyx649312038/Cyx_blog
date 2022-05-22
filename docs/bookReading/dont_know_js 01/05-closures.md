## 了解闭包
初尝闭包
:::tip
当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时 就产生了闭包。
:::
```js
function foo() { 
    var a = 2;
    function bar() {
        console.log( a );
    }
    return bar; 
}
var baz = foo();
baz(); // 2 —— 朋友，这就是闭包的效果。
```
> 在 foo() 执行后，通常会期待 foo() 的整个内部作用域都被销毁，因为我们知道引擎有垃 圾回收器用来释放不再使用的内存空间。由于看上去 foo() 的内容不会再被使用，所以很 自然地会考虑对其进行回收。
>
>而闭包的“神奇”之处正是可以阻止这件事情的发生。事实上内部作用域依然存在，因此 没有被回收。谁在使用这个内部作用域?原来是 bar() 本身在使用。
>
>拜 bar() 所声明的位置所赐，它拥有涵盖 foo() 内部作用域的闭包，使得该作用域能够一 直存活，以供 bar() 在之后任何时间进行引用。
bar() 依然持有对该作用域的引用，而这个引用就叫作闭包。

再来
```js
function foo() { 
    var a = 2;
    function baz() {
        console.log( a ); // 2
    }
    bar( baz ); 
}
function bar(fn) {
    fn(); // 妈妈快看呀，这就是闭包!
}
```
>无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对原始定义作用 域的引用，无论在何处执行这个函数都会使用闭包(即对这个作用域的引用)。

又如一些很常见的闭包的用处
```js

function wait(message) {
    setTimeout( function timer() {
        console.log( message );
    }, 1000 ); 
}
wait( "Hello, closure!" );
//将一个内部函数(名为 timer)传递给 setTimeout(..)。timer 具有涵盖 wait(..) 作用域的闭包，
//因此还保有对变量 message 的引用。

function setupBot(name, selector) {
    $( selector ).click( function activator() {
        console.log( "Activating: " + name );
    } );
}
setupBot( "Closure Bot 1", "#bot_1" );
setupBot( "Closure Bot 2", "#bot_2" );
```
:::tip
在定时器、事件监听器、 Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)任务中，只要使 用了回调函数，实际上就是在使用闭包!
:::
## 闭包的强大威力
### 1.循环和闭包
```js
for (var i=1; i<=5; i++) { //i被封闭在一个共享的全局作用域中，因此实际上只有一个 i
    setTimeout( function timer() {
        console.log( i ); // 6，6，6，6，6
    }, i*1000 );
}


for (var i=1; i<=5; i++) { //利用闭包（setTimeout内部调用回调函数，
                           //因为此时形成了闭包所以setTimeout所在的域内的变量没有被垃圾回收机制回收）
    (function(j) {
        setTimeout( function timer() { 
            console.log( j );
        }, j*1000 );
    })( i );
}

for (let i=1; i<=5; i++) {
    setTimeout( function timer() {
        console.log( i );
    }, i*1000 );
}
```
### 2.模块
> 模块有两个主要特征:(1)为创建内部作用域而调用了一个包装函数;(2)包装函数的返回 值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭 包。
```js
var MyModules = (function Manager() {
    var modules = {};
    function define(name, deps, impl) {
        for (var i=0; i<deps.length; i++) {
            deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply( impl, deps );
}
    function get(name) { 
        return modules[name];
    }
return {
    define: define,
    get: get };
})();

MyModules.define( "bar", [], function() { 
    function hello(who) {
        return "Let me introduce: " + who; 
    }
    return {
    hello: hello
    };
} );
MyModules.define( "foo", ["bar"], function(bar) {
    var hungry = "hippo";
    function awesome() {
    console.log( bar.hello( hungry ).toUpperCase() );
    }
    return {
        awesome: awesome
    }; } );
var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );
console.log(bar.hello( "hippo" )); // Let me introduce: hippo foo.awesome(); // LET ME INTRODUCE: HIPPO
```