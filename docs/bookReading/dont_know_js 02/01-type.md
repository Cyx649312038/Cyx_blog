js是一门弱类型语言，关于强类型弱类型区别看下面链接

[强类型和弱类型](https://baike.baidu.com/item/%E5%BC%BA%E7%B1%BB%E5%9E%8B/5074514)

## 内置类型
JavaScript 有七种内置类型:
1. 空值(null)
2. 未定义(undefined)
3. 布尔值( boolean)
4. 数字(number)
5. 字符串(string)
6. 对象(object)
7. 符号(symbol，ES6 中新增)
>除了对象外，其他统称为“基本类型”，可以用 typeof 来判断值的类型但是null例外，typeof 运算符总是会返回一个字符串:。
```js
typeof null //object
//我们需要使用复合条件来检测 null 值的类型:
(!a && typeof a === "object"); // true
```
```js
typeof function a(b,c){ /* .. */ } === "function"; // true
```
>这样看来，function(函数)也是 JavaScript 的一个内置类型。然而查阅规范就会知道， 它实际上是 object 的一个“子类型”。具体来说，函数是“可调用对象”，它有一个内部属 性 [[Call]]，该属性使其可以被调用。函数对象的 length 属性是其声明的参数的个数: a.length // 2

```js
typeof [1,2,3] === "object"; // true
```
> 数组也是对象。确切地说，它也是 object 的一个“子类型”(参见第 3 章)

## 值和类型
JavaScript 中的变量是没有类型的，只有值才有。变量可以随时持有任何类型的值。
### undefined 和 undeclared
已在作用域中声明但还没有赋值的变量，是 undefined 的。相反，还没有在作用域中声明 过的变量，是 undeclared 的。
```js
var a;
a; // undefined
b; // ReferenceError: b is not defined
```
:::tip
浏览器对这类情况的处理很让人抓狂。上例中，“b is not defined”容易让人误以为是“b is undefined”。
这里再强调一遍，“undefined”和“is not defined”是两码事。
更让人抓狂的是 typeof 处理 undeclared 变量的方式,对于 undeclared(或者 not defined)变量，typeof 照样返回 "undefined"。
:::
```js
var a;
typeof a; // "undefined"
typeof b; // "undefined"
```


