## node环境下的this和浏览器下的this
```js
this.name = 'win'
console.log(this == global) //false
function test () {
    console.log(this == global) true
    console.log(this.name) //undefined
}
test()
```
:::tip
注意node环境中的this和浏览器下的this不一样，node的全局对象是global，window的全局对象是window，node中最外层this不等于全局作用域global而是module.exports。而且在最外层调用函数，将会使得函数指向global。
:::

## 改变this指向的方法
### 1.隐式绑定
当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。因为调 用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的。

```js
function foo() { console.log( this.a );
}
var obj = { 
    a: 2,
    foo: foo };
obj.foo(); // 2

```
### 2.显式绑定
1. 利用apply call  bind(硬绑定)

2. 利用API调用的“上下文。

第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一 个可选的参数，通常被称为“上下文”(context)，其作用和 bind(..) 一样，确保你的回调 函数使用指定的 this。例如foreach的第二个参数（some、map等函数都是如此），我们可以直接使用第二个参数来指定函数里的this的值
```js
function foo(el) {
    console.log( el, this.id );
}
var obj = {
    id: "awesome"
};
// 调用 foo(..) 时把 this 绑定到 obj 
[1, 2, 3].forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```
这些函数实际上就是通过 call(..) 或者 apply(..) 实现了显式绑定，这样你可以少些一些 代码。

3. 软绑定（硬绑定的一种优化）
之前我们已经看到过，硬绑定这种方式可以把 this 强制绑定到指定的对象(除了使用 new 时)，防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使 用硬绑定之后就无法使用隐式绑定或者显式绑定来修改 this。

```js
if (!Function.prototype.softBind) { 
    Function.prototype.softBind = function(obj) {
    var fn = this;
    // 捕获所有 curried 参数
    var curried = [].slice.call( arguments, 1 ); 
    var bound = function() {
        return fn.apply(
            (!this || this === (window || global)) ?
                obj : this
            curried.concat.apply( curried, arguments )
        ); 
    };
    bound.prototype = Object.create( fn.prototype );
    return bound; 
    };
}
```
它会对指定的函 数进行封装，首先检查调用时的 this，如果 this 绑定到全局对象或者 undefined，那就把 指定的默认对象 obj 绑定到 this，否则不会修改 this。

### 3.new绑定
```js
function foo(a) { 
    this.a = a;
}
var bar = new foo(2);
console.log( bar.a ); // 2

```
## 箭头函数中的this
箭头函数不使用 this 的四种标准规则，而是根据外层(函数或者全局)作用域来决 定 this。
```js
function foo() {
// 返回一个箭头函数 
    return (a) => {
//this 继承自 foo()
        console.log( this.a ); 
    };
}
var obj1 = { 
    a:2
};
var obj2 = { 
    a:3
};
var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, 不是 3 !
```