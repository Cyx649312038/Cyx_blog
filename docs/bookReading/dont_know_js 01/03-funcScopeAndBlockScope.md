## 函数声明和函数表达式
:::tip
数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处。
:::
```js
// var a = 2;
// function foo() { // <-- 添加这一行
//     var a = 3; 
//     console.log( a ); // 3
// } // <-- 以及这一行 foo(); // <-- 以及这一行
// console.log( a ); // 2

var a = 2
(function foo(){ // <-- 添加这一行 
    var a = 3;
    console.log( a ); // 3 
})(); // <-- 以及这一行 
console.log( a ); // 2
console.log(foo) //foo is not defined
```
> foo 被绑定在函数表达式自身的函数中而不是所在作用域中。
换句话说，(function foo(){ .. })作为函数表达式意味着foo只能在..所代表的位置中被访问，外部作用域则不行。foo 变量名被隐藏在自身中意味着不会非必要地污染外部作 用域。
## 立即执行函数
```js
var a = 2;
(function IIFE( global ) {
    var a = 3;
    console.log( a ); // 3 
    console.log( global.a ); // 2
})( window );
console.log( a ); // 2

(function IIFE( global ) {
    var a = 3;
    console.log( a ); // 3 
    console.log( global.a ); // 2
}( window ));
console.log( a ); // 2
```
## try() catch()的块级作用域
```js
{
    let a = 2;
    console.log( a ); // 2
}
console.log( a ); // ReferenceError

//这段代码在 ES6 环境中可以正常工作。但是在 ES6 之前的环境中如何才能实现这个效果

try{
    throw 2;
}catch(a){ 
    console.log( a ); // 2
}
console.log( a ); // ReferenceError

{
    try {
        throw undefined;
    } catch (a) {
        a = 2;
        console.log( a );
    }
}
console.log( a );

```
:::tip
通过使用这样的工具，我们就可以在使用块作用域时无需考虑目标平台是否是 ES6 环境， 因为 try/catch 从 ES3 开始就存在了(并且一直是这样工作的)。
:::


