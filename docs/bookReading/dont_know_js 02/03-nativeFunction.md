常用的原生函数(内建函数)有:

1. String()
2. Number()
3. Boolean()
4. Array()
5. Object()
6. Function()
7. RegExp()
8. Date()
9. Error()
10. Symbol()——ES6 中新加入的!

```js
var a = new String( "abc" );
typeof a; // 是"object"，不是"String" 
a instanceof String; // true 
Object.prototype.toString.call( a ); // "[object String]"
```
:::tip
new String("abc") 创建的是字符串 "abc" 的封装对象，而非基本类型值 "abc"。
:::

## 内部属性[[Class]]
所有 typeof 返回值为 "object" 的对象(如数组)都包含一个内部属性 [[Class]](我们可 以把它看作一个内部的分类，而非传统的面向对象意义上的类)。这个属性无法直接访问， 一般通过 Object.prototype.toString(..) 来查看。例如:
```js
Object.prototype.toString.call( [1,2,3] );
     // "[object Array]"
Object.prototype.toString.call( /regex-literal/i );
     // "[object RegExp]"
Object.prototype.toString.call( null );
     // "[object Null]"
Object.prototype.toString.call( undefined );
     // "[object Undefined]"
Object.prototype.toString.call( "abc" );
     // "[object String]"
Object.prototype.toString.call( 42 );
     // "[object Number]"
Object.prototype.toString.call( true );
     // "[object Boolean]"
```
:::tip
上例中基本类型值被各自的封装对象自动包装，所以它们的内部 [[Class]] 属性值分别为 "String"、"Number" 和 "Boolean"。
:::

## 封装和拆封
由于基本类型值没有 .length 和 .toString() 这样的属性和方法，需要通过封装对象才能访问，此时 JavaScript 会自动为 基本类型值包装(box 或者 wrap)一个封装对象:
（即在有需要时js会自动封装）
```js
var a = "abc";
a.length; // 3
a.toUpperCase(); // "ABC"
```
如果想要自行封装基本类型值，也可以使用 Object(..) 函数(不带 new 关键字):
```js
var a = "abc";
var b = new String( a );
var c = Object( a );
typeof a; // "string"
typeof b; // "object"
typeof c; // "object"
b instanceof String; // true
c instanceof String; // true
Object.prototype.toString.call( b ); // "[object String]"
Object.prototype.toString.call( c ); // "[object String]"
```
如果想要得到封装对象中的基本类型值，可以使用 valueOf() 函数:
```js
var a = new String( "abc" );
var b = new Number( 42 );
var c = new Boolean( true );
a.valueOf(); // "abc"
b.valueOf(); // 42
c.valueOf(); // true
```
在需要用到封装对象中的基本类型值的地方会发生隐式拆封。具体过程(即强制类型转 换)将在第 4 章详细介绍。

```js
var a = new String( "abc" ); var b = a + ""; // b的值为"abc"
typeof a;       // "object"
typeof b;       // "string"

```

## 原生函数作为构造函数
  ### Array(...)
  ```js
  var a = new Array( 1, 2, 3 ); //构造函数 Array(..) 不要求必须带 new 关键字。不带时，它会被自动补上。
  a; // [1, 2, 3]
  var b = [1, 2, 3];
  b; // [1, 2, 3]
  ```
  :::tip
  Array 构造函数只带一个数字参数的时候，该参数会被作为数组的预设长度(length)，而 非只充当数组中的一个元素。
  更为关键的是，数组并没有预设长度这个概念。这样创建出来的只是一个空数组，只不过
  它的 length 属性被设置成了指定的值。数组里没有任何的单元，
  :::
  ### Object(..)、Function(..) 和 RegExp(..)
  ### Date(..) 和 Error(..)
  ### Symbol(...)
  ES6 中新加入了一个基本数据类型 ——符号(Symbol)。符号是具有唯一性的特殊值(并 非绝对)，用它来命名对象属性不容易导致重名。

  符号可以用作属性名，但无论是在代码还是开发控制台中都无法查看和访问它的值，只会 显示为诸如 Symbol(Symbol.create) 这样的值。
  ```js
    let sy1 =  Symbol()
    let sy2 =  Symbol()
    let obj = {
        [sy1]:'111',
        [sy2]: '222'
    }
    console.log(obj,obj.sy1, obj.sy2, obj[sy1],obj[sy2]);
    //{Symbol(): "111", Symbol(): "222"} undefined undefined "111" "222"
    for(let k in obj) {
        console.log('k',k);
    } // 啥都没有
  ```
  我们可以使用 Symbol(..) 原生构造函数来自定义符号。但它比较特殊，不能带 new 关键
  字，否则会出错:
  ```js
//   var mysym = new Symbol( "my own symbol" ); //Symbol is not a constructor
  var mysym = Symbol( "my own symbol" );
  mysym;// Symbol(my own symbol)
  mysym.toString();// "Symbol(my own symbol)"
  typeof mysym;// "symbol"
  var a = { };
  a[mysym] = "foobar";
  Object.getOwnPropertySymbols( a );
  // [ Symbol(my own symbol) ]
  ```
  :::tip
  虽然符号实际上并非私有属性(通过 Object.getOwnPropertySymbols(..) 便可以公开获得 对象中的所有符号)，但它却主要用于私有或特殊属性。很多开发人员喜欢用它来替代有 下划线(_)前缀的属性，而下划线前缀通常用于命名私有或特殊属性。
  :::

## 原生原型
有些原生原型(native prototype)并非普通对象那么简单:
:::tip
Function.prototype 是一个空函数，RegExp.prototype 是一个“空”的正则表达式(无 任何匹配)，而 Array.prototype 是一个空数组。对未赋值的变量来说，它们是很好的默 认值。
:::
这种方法的一个好处是 .prototypes 已被创建并且仅创建一次。相反，如果将 []、
function(){} 和 /(?:)/ 作为默认值，则每次调用 isThisCool(..) 时它们都会被创建一次 (具体创建与否取决于 JavaScript 引擎，稍后它们可能会被垃圾回收)，这样无疑会造成内
存和 CPU 资源的浪费。
