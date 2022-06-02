## 函数优先
```js
foo(); // 1
var foo;
function foo() { console.log( 1 );
}
foo = function() { console.log( 2 );
};
```
:::tip
注意，var foo 尽管出现在 function foo()... 的声明之前，但它是重复的声明(因此被忽 略了)，因为函数声明会被提升到普通变量之前。
:::
尽管重复的 var 声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的
```js
foo(); // 3
function foo() { 
    console.log( 1 );
}
var foo = function() { 
    console.log( 2 );
};
function foo() { 
    console.log( 3 );
}

```
一个普通块内部的函数声明通常会被提升到所在作用域的顶部，这个过程不会像下面的代 码暗示的那样可以被条件判断所控制:
```js
foo(); // "b"
var a = true; if (a) {
function foo() { console.log("a"); } }
else {
function foo() { console.log("b"); }
}
```