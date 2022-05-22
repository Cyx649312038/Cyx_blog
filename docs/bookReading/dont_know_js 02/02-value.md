## 数组
数组通过数字进行索引，但有趣的是它们也是对象，所以也可以包含字符串键值和属性 (但这些并不计算在数组长度内)
```js
var a = [];
a[0] = 1;
a["foobar"] = 2;
a.length;
a["foobar"];
a.foobar;
// 1 // 2 // 2
```
这里有个问题需要特别注意，如果字符串键值能够被强制类型转换为十进制数字的话，它 就会被当作数字索引来处理。
```js
var a = [ ];
a["13"] = 42;
a.length; // 14
```
  ### 类数组
  关于类数组的相关介绍看下面链接:

  [类数组](https://www.cnblogs.com/lulin1/p/7459933.html#:~:text=js%EF%BC%8D%20%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1.%20JavaScript%E4%B8%AD%EF%BC%8C%E6%95%B0%E7%BB%84%E6%98%AF%E4%B8%80%E4%B8%AA%E7%89%B9%E6%AE%8A%E7%9A%84%E5%AF%B9%E8%B1%A1%EF%BC%8C%E5%85%B6property%E5%90%8D%E4%B8%BA%E6%AD%A3%E6%95%B4%E6%95%B0%EF%BC%8C%E4%B8%94%E5%85%B6length%E5%B1%9E%E6%80%A7%E4%BC%9A%E9%9A%8F%E7%9D%80%E6%95%B0%E7%BB%84%E6%88%90%E5%91%98%E7%9A%84%E5%A2%9E%E5%87%8F%E8%80%8C%E5%8F%91%E7%94%9F%E5%8F%98%E5%8C%96%EF%BC%8C%E5%90%8C%E6%97%B6%E5%8F%88%E4%BB%8EArray%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%BB%A7%E6%89%BF%E4%BA%86%E4%B8%80%E4%BA%9B%E7%94%A8%E4%BA%8E%E8%BF%9B%E8%A1%8C%E6%95%B0%E7%BB%84%E6%93%8D%E4%BD%9C%E7%9A%84%E6%96%B9%E6%B3%95%E3%80%82.,%E8%80%8C%E5%AF%B9%E4%BA%8E%E4%B8%80%E4%B8%AA%E6%99%AE%E9%80%9A%E7%9A%84%E5%AF%B9%E8%B1%A1%E6%9D%A5%E8%AF%B4%EF%BC%8C%E5%A6%82%E6%9E%9C%E5%AE%83%E7%9A%84%E6%89%80%E6%9C%89property%E5%90%8D%E5%9D%87%E4%B8%BA%E6%AD%A3%E6%95%B4%E6%95%B0%EF%BC%8C%E5%90%8C%E6%97%B6%E4%B9%9F%E6%9C%89%E7%9B%B8%E5%BA%94%E7%9A%84%20length%20%E5%B1%9E%E6%80%A7%EF%BC%8C%E9%82%A3%E4%B9%88%E8%99%BD%E7%84%B6%E8%AF%A5%E5%AF%B9%E8%B1%A1%E5%B9%B6%E4%B8%8D%E6%98%AF%E7%94%B1Array%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E6%89%80%E5%88%9B%E5%BB%BA%E7%9A%84%EF%BC%8C%E5%AE%83%E4%BE%9D%E7%84%B6%E5%91%88%E7%8E%B0%E5%87%BA%E6%95%B0%E7%BB%84%E7%9A%84%E8%A1%8C%E4%B8%BA%EF%BC%8C%E5%9C%A8%20) 、
 [类数组](https://blog.csdn.net/qq_39225639/article/details/120070969)

  有时需要将类数组(一组通过数字索引的值)转换为真正的数组，这一般通过数组工具函数(如 indexOf(..)、concat(..)、forEach(..) 等)来实现。
  ```js
    function foo() {
         var arr = Array.prototype.slice.call( arguments );
         arr.push( "bam" );
         console.log( arr );
     }
     foo( "bar", "baz" ); // ["bar","baz","bam"]
  ```
  关于Array.prototype.slice和arguments看下面链接
  [类数组转换成真数组](https://juejin.cn/post/7038934664048246798)

  es6中Array.from(...)也能实现后面你不知道的js(下)es6中会介绍

## 字符串
JavaScript 中字符串是不可变的，而数组是可变的。字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符 串。而数组的成员函数都是在其原始值上进行操作。

许多数组函数用来处理字符串很方便。虽然字符串没有这些函数，但可以通过“借用”数 组的非变更方法来处理字符串:
```js
var a = 'foo';
a.join;         // undefined
a.map;          // undefined
var c = Array.prototype.join.call( a, "-" ); // 类似上面的Array.prototype.slice.call( arguments )具体为什么可以这么实现就要看join函数的源码了
var d = Array.prototype.map.call( a, function(v){
         return v.toUpperCase() + ".";
        } ).join( "" );
c;              // "f-o-o"
d;              // "F.O.O."
```

## 数字
JavaScript 没有真正意义上的整数，JavaScript 中的“整数”就是没有小数的十进制数。所以 42.0 即等同于“整数”42

数字常量定义时数字前的0可以省略，小数点小数点后小数部分最后面的 0 也可以省，但不建议这么写
```js
var a = 0.42
var b = .42

var a = 42.0
var b = 42.
```

不过对于 . 运算符需要给予特别注 意，因为它是一个有效的数字字符，会被优先识别为数字常量的一部分，然后才是对象属 性访问运算符。
```js
// 无效语法:
42.toFixed( 3 ); // SyntaxError
// 下面的语法都有效: 
(42).toFixed( 3 ); // "42.000" 
0.42.toFixed( 3 ); // "0.420" 
42..toFixed( 3 ); // "42.000"
42 .toFixed( 3 ) // "42.000"
```
:::tip
42.tofixed(3) 是无效语法，因为 . 被视为常量 42. 的一部分(如前所述)，所以没有 . 属 性访问运算符来调用 tofixed 方法。
:::


  ### 较小的数值
  ```js
  0.1 + 0.2 === 0.3; // false
  ```
  :::tip
  简单来说，二进制浮点数中的 0.1 和 0.2 并不是十分精确，它们相加的结果并非刚好等于 0.3，而是一个比较接近的数字 0.30000000000000004，所以条件判断结果为 false
  :::

  ### 整数的安全范围
  能够被“安全”呈现的最大整数是2^53 - 1，即9007199254740991，在ES6中被定义为 Number.MAX_SAFE_INTEGER。 最 小 整 数 是 -9007199254740991， 在 ES6 中 被 定 义 为 Number. MIN_SAFE_INTEGER。

  有时 JavaScript 程序需要处理一些比较大的数字，如数据库中的 64 位 ID 等。由于 JavaScript 的数字类型无法精确呈现 64 位数值，所以必须将它们保存(转换)为字符串。
   
  ### 整数检测
  要检测一个值是否是整数，可以使用 ES6 中的 Number.isInteger(..) 方法:
  ```js
    Number.isInteger( 42 );     // true
    Number.isInteger( 42.000 ); // true
    Number.isInteger( 42.3 );   // false
  ```
  要检测一个值是否是安全的整数，可以使用 ES6 中的 Number.isSafeInteger(..) 方法:
  ```js
  //ath.pow() 函数返回基数（base）的指数（exponent）次幂，即 base^exponent。
  // console.log(Math.pow(4, 0.5));
  // expected output: 2
   Number.isSafeInteger( Number.MAX_SAFE_INTEGER );
   Number.isSafeInteger( Math.pow( 2, 53 ) );
   Number.isSafeInteger( Math.pow( 2, 53 ) - 1 );
// true
// false
  ```
## 特殊数值
• undefined 指从未赋值

• null 指曾赋过值，但是目前没有值

null 是一个特殊关键字，不是标识符，我们不能将其当作变量来使用和赋值。然而
undefined 却是一个标识符，可以被当作变量来使用和赋值。

  ### void 运算符
  undefined 是一个内置标识符(除非被重新定义，见前面的介绍)，它的值为 undefined， 通过 void 运算符即可得到该值。
  ```js
    var a = 42;
    console.log( void a, a ); // undefined 42
  ```
  ### 特殊的数字
  1. NaN

  如果数学运算的操作数不是数字类型(或者无法解析为常规的十进制或十六进制数字)， 就无法返回一个有效的数字，这种情况下返回值为 NaN。
  NaN 是一个“警戒值”(sentinel value，有特殊用途的常规值)，用于指出数字类型中的错误 情况，即“执行数学运算没有成功，这是失败后返回的结果”
  ```js
    var a = 2 / "foo";      // NaN
    typeof a === "number";  // true 注意仍然是数字类型
  ```

  如何判断是否为NaN

  ```js
    var a = 2 / "foo";
    a == NaN;   // false
    a === NaN;  // false
  ```
  :::tip
  NaN是一个特殊值，它和自身不相等，是唯一一个非自反(自反，reflexive，即x === x不 成立)的值。而 NaN != NaN 为 true，很奇怪吧?
  :::
  ```js
  var a = 2 / "foo";
  isNaN( a ); // true


  var a = 2 / "foo";
  var b = "foo";
  a; // NaN
  b; "foo"
  window.isNaN( a ); // true window.isNaN( b ); // true——晕!
  ```
  >isNaN(..) 有一个严重的缺陷，它的检查方式过于死板，就 是“检查参数是否不是 NaN，也不是数字”。但是这样做的结果并不太准确:
  从 ES6 开始我们可以使用工具函数 Number.isNaN(..)。ES6 之前的浏览器的 polyfill 如下:
  ```js
     if (!Number.isNaN) {
         Number.isNaN = function(n) {
             return (
                 typeof n === "number" &&
                 window.isNaN( n )
        ); };   
    }
     var a = 2 / "foo";
     var b = "foo";
     Number.isNaN( a ); // true Number.isNaN( b ); // false——好!

     //实际上还有一个更简单的方法，即利用 NaN 不等于自身这个特点。NaN 是 JavaScript 中唯 一一个不等于自身的值。

     if (!Number.isNaN) {
         Number.isNaN = function(n) {
             return n !== n;
         };
     }

  ```

  2. 无穷数

    熟悉传统编译型语言(如 C)的开发人员可能都遇到过编译错误(compiler error)或者运 行时错误(runtime exception)，例如“除以 0”:

    var a = 1 / 0;

    然而在 JavaScript 中上例的结果为 Infinity(即 Number.POSITIVE_INfiNITY)。同样:
    ```js
     var a = 1 / 0;  // Infinity
     var b = -1 / 0; // -Infinity
    ```

  3. 零值

  JavaScript 有一个常规的 0(也叫作 +0)和一个 -0
  ```js
    var a = 0 / -3; // -0
    var b = 0 * -3; // -0
  ```
  :::tip
  加法和减法运算不会得到负零(negative zero)
  :::
  对负零进行字符串化会返回 "0
  ```js
   var a = 0 / -3;
   // 至少在某些浏览器的控制台中显示是正确的 a; // -0
   // 但是规范定义的返回结果是这样!
   a.toString();  //0
   a + "";        //0
   String( a );   //0
   // JSON也如此，很奇怪 
   JSON.stringify( a );// "0"
   ```
  有意思的是，如果反过来将其从字符串转换为数字，得到的结果是准确的
  ```js
     +"-0";              // -0
     Number( "-0" );     // -0
     JSON.parse( "-0" ); // -0
  ```
  比较操作也是如此
  ```js
  var a = 0;
  var b = 0 / -3; //-0
  a == b; // true
  -0 == 0;// true
  a === b;// true
  0 > -0; //false
  a > b;// false

  ```
  区分 -0 和 0，不能仅仅依赖开发调试窗口的显示结果，还需要做一些特殊处理:
  ```js
   function isNegZero(n) {
         n = Number( n );
         return (n === 0) && (1 / n === -Infinity);
     }
   isNegZero( -0 );// true
   isNegZero( 0 / -3 );// true
   isNegZero( 0 );// false
  ```
  :::tip
  有些应用程序中的数据需要以级数形式来表示(比如动画帧的移动速度)，数字的符号位 (sign)用来代表其他信息(比如移动的方向)。此时如果一个值为 0 的变量失去了它的符
  号位，它的方向信息就会丢失。所以保留 0 值的符号位可以防止这类情况发生。
  :::

  4. 特殊等式
  
   ES6 中新加入了一个工具方法 Object.is(..) 来判断两个值是否绝对相等，可以用来处理 上述所有的特殊情况(判断-0和0 是不是NaN):
   ```js
     var a = 2 / "foo"; //NaN
     var b = -3 * 0;    //-0
     Object.is( a, NaN ); //true
     Object.is( b, -0 );  // true
     Object.is( b, 0 );  //false
   ```
  :::tip
  能使用 == 和 ===(参见第 4 章)时就尽量不要使用 Object.is(..)，因为前者效率更高、
  更为通用。Object.is(..) 主要用来处理那些特殊的相等比较。
  :::

## 值和引用

  

    

  


