// 函数表达式和函数声明区别它们的名称标识符将会绑定在何处
var a = 2;
// function foo(){ //
//     var a = 3;
//     console.log( a ); // 3 
// }
(function foo(){ // 
    var a = 3;
    console.log( a ); // 3 
})(); 
console.log( a ); // 2
console.log(foo) //foo is not defined
// foo 被绑定在函数表达式自身的函数中而不是所在作用域中。
// 换句话说，(function foo(){ .. })作为函数表达式意味着foo只能在..所代表的位置中 被访问，外部作用域则不行。foo 变量名被隐藏在自身中意味着不会非必要地污染外部作 用域。

// es6还不支持这样写
// let(a = 2) {
//     console.log(a);
// }