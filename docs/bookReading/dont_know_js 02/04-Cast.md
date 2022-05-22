## 抽象值操作
ES5 规范第 9 节中定义了一些“抽象操作”(即“仅供内部使用的操作”)和转 换规则。这里我们着重介绍 ToString、ToNumber 和 ToBoolean，附带讲一讲 ToPrimitive。
### ToString
基本类型值的字符串化规则为:null 转换为 "null"，undefined 转换为 "undefined"，true 转换为 "true"。数字的字符串化则遵循通用规则，不过第 2 章中讲过的那些极小和极大的 数字使用指数形式:
```js
// 1.07 连续乘以七个 1000
var a = 1.07 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000;
// 七个1000一共21位数字 
a.toString(); // "1.07e21"
```
对普通对象来说，除非自行定义，否则 toString()(Object.prototype.toString())返回 内部属性 [[Class]] 的值(参见第 3 章)，如 "[object Object]"。

数组的默认 toString() 方法经过了重新定义，将所有单元字符串化以后再用 "," 连接起 来: [1,2,3].toString // 1,2,3

toString() 可以被显式调用，或者在需要字符串化时自动调用。
###  JSON.stringify(...)
工具函数 JSON.stringify(..) 在将 JSON 对象序列化为字符串时也用到了 ToString。
```js
JSON.stringify( 42 ); // "42"
JSON.stringify( "42" ); // ""42""(含有双引号的字符串) 
JSON.stringify( null ); // "null"
JSON.stringify( true ); // "true"
```
:::tip
undefined、function、symbol (ES6+)和包含循环引用(对象之间相互引用，形成一个无限循环)的对象都不符合 JSON
结构标准，支持 JSON 的语言无法处理它们。JSON.stringify(..) 在对象中遇到 undefined、function 和 symbol 时会自动将其忽略，在
数组中则会返回 null(以保证单元位置不变)
:::
```js
JSON.stringify( undefined );
JSON.stringify( function(){} ); //undefined
JSON.stringify(
    [1,undefined,function(){},4]
);                             // "[1,null,null,4]"
JSON.stringify(
    { a:2, b:function(){} }
)                              // {a:2}
//  对包含循环引用的对象执行 JSON.stringify(..) 会出错。
// a = {
//     o: {
//         a
//     }
// }
```
> 如果对象中定义了 toJSON() 方法，JSON 字符串化时会首先调用该方法，然后用它的返回 值来进行序列化。toJSON() 应该“返回一个能够被字符串化的安全的 JSON 值”，而不是“返回 一个 JSON 字符串”。

```js
 var a = {
    val: [1,2,3],
// 可能是我们想要的结果! 
    toJSON: function(){
        return this.val.slice( 1 );
        }
};
var b = {
    val: [1,2,3],
// 可能不是我们想要的结果! 
    toJSON: function(){
             return "[" +
                this.val.slice( 1 ).join() +
            "]"; 
            }
};
JSON.stringify( a ); // "[2,3]"
JSON.stringify( b ); // ""[2,3]""
```
我们可以向 JSON.stringify(..) 传递一个可选参数 replace

如果 replacer 是一个数组，那么它必须是一个字符串数组，其中包含序列化要处理的对象 的属性名称，除此之外其他的属性则被忽略。

如果 replacer 是一个函数，它会对对象本身调用一次，然后对对象中的每个属性各调用 一次，每次传递两个参数，键和值。如果要忽略某个键就返回 undefined，否则返回指定 的值。

```js
var a = { 
    b: 42,
    c: "42",
    d: [1,2,3]  //由于字符串化是递归的，因 此数组 [1,2,3] 中的每个元素都会通过参数 v 传递给 replacer，即 1、2 和 3， 参数 k 是它们的索引值，即 0、1 和 2。
};
JSON.stringify( a, ["b","c"] ); // "{"b":42,"c":"42"}"
JSON.stringify( a, function(k,v){
    if (k !== "c") return v;
} );
     // "{"b":42,"d":[1,2,3]}"
```
> JSON.string 还有一个可选参数 space，用来指定输出的缩进格式。

:::tip
(1) 字符串、数字、布尔值和 null 的 JSON.stringify(..) 规则与 ToString 基本相同。
(2) 如果传递给 JSON.stringify(..) 的对象中定义了 toJSON() 方法，那么该方法会在字符
串化前调用，以便将对象转换为安全的 JSON 值。
:::
## ToNumber

## ToBoolean

## 显式强制类型转换

### 字符串和数字之间
```js
var a = 42;
var b = String( a ); //注意不带new 不是封装对象
var c = "3.14";
var d = Number( c );
b; // "42"
d; // 3.14

var a = 42;
var b = a.toString();
var c = "3.14";
var d = +c;
b; // "42"
d; // 3.14
```
:::tip
toString() 对 42 这样的基本类型值不适用，所以 JavaScript 引擎会自动为 42 创建一个封 装对象(参见第 3 章)，然后对该对象调用 toString()。
:::
>上例中 +c 是 + 运算符的一元(unary)形式(即只有一个操作数)。+ 运算符显式地将 c 转 换为数字，而非数字加法运算(也不是字符串拼接，见下)。
```js
var c = "3.14";
var d = 5+ +c;
d; // 8.14
```

1. 日期显式转换为数字
```js
var timestamp = +new Date();
var timestamp = new Date().getTime()
var timestamp = Date.now()
```
:::tip
我们不建议对日期类型使用强制类型转换，应该使用 Date.now() 来获得当前的时间戳，使
用 new Date(..).getTime() 来获得指定时间的时间戳。
:::

2. ~运算符
~x 大致等同于 -(x+1）
```js
~42  //-43

var a = "Hello World";
~a.indexOf( "lo" );// -4 // true
if (~a.indexOf( "lo" )) { 
// 找到匹配!
}
~a.indexOf( "ol" );// 0
!~a.indexOf( "ol" );// true
if (!~a.indexOf( "ol" )) { // true 
// 没有找到匹配!
}
```
:::tip
在 -(x+1) 中唯一能够得到 0(或者严格说是 -0)的 x 值是 -1。也就是说如果 x 为 -1 时，~
和一些数字值在一起会返回假值 0，其他情况则返回真值。
:::
### 显式解析数字字符串
解析允许字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停 止。而转换不允许出现非数字字符，否则会失败并返回 NaN。
```js
var a = "42";
var b = "42px";
Number( a );    // 42
parseInt( a );  // 42
Number( b );    // NaN
parseInt( b );  // 42
```
:::tip
不要忘了 parseInt(..) 针对的是字符串值。非字符串参数会首先被强制类型转换为字符串(参见 4.2.1 节)，依赖这样的隐式强制类型 转换并非上策，应该避免向 parseInt(..) 传递非字符串参数。
:::

### 显式转换为布尔值
```js
var a = "0";
Boolean( a ); // true

var b = [];
!!b  //true

```
:::tip
在 if(..).. 这样的布尔值上下文中，如果没有使用 Boolean(..) 和 !!，就会自动隐式地进 行 ToBoolean 转换。建议使用 Boolean(..) 和 !! 来进行显式转换以便让代码更清晰易读。
:::

## 隐式强制类型转换
 ### 字符串和数字
 ```js
var a = "42";
var b = "0";
a + b; // "420"

var a = [1,2];
var b = [3,4];
a + b; // "1,23,4"
 ```
:::tip
为了将值转换为相应的基本类型值，抽象操作 ToPrimitive(参见 ES5 规范 9.1 节)会首先 (通过内部操作 DefaultValue，参见 ES5 规范 8.12.8 节)检查该值是否有 valueOf() 方法。 如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString()
的返回值(如果存在)来进行强制类型转换。
:::
根据 ES5 规范 11.6.1 节，如果某个操作数是字符串或者能够通过以下步骤转换为字符串 的话，+ 将进行拼接操作。如果其中一个操作数是对象(包括数组)，则首先对其调用 ToPrimitive 抽象操作(规范 9.1 节)，该抽象操作再调用 [[DefaultValue]](规范 8.12.8 节)，以数字作为上下文。
你或许注意到这与 ToNumber 抽象操作处理对象的方式一样(参见 4.2.2 节)。因为数组的 valueOf() 操作无法得到简单基本类型值，于是它转而调用 toString()。因此上例中的两 个数组变成了 "1,2" 和 "3,4"。+ 将它们拼接后返回 "1,23,4"。
简单来说就是，如果 + 的其中一个操作数是字符串(或者通过以上步骤可以得到字符串)， 则执行字符串拼接;否则执行数字加法。

>注意a+''和String（）的一个区别
a + ""(隐式)和前面的String(a)(显式)之间有一个细微的差别需要注意。根据 ToPrimitive抽象操作规则，a + ""会对a调用valueOf()方法，然后通过ToString抽象 操作将返回值转换为字符串。而 String(a) 则是直接调用 ToString()。

### 布尔值和数字
```js
function onlyOne(a,b,c) {
    return !!((a && !b && !c) ||
        (!a && b && !c) || (!a && !b && c)); //如果其中有且仅有一个参数为 true，则 onlyOne(..) 返回 true
}
var a = true;
var b = false;
onlyOne( a, b, b ); // true
onlyOne( b, a, b ); // true
onlyOne( a, b, a ); // false

//利用隐式转换成数字处理来优化
 function onlyOne() {
    var sum = 0;
    for (var i=0; i < arguments.length; i++) { // 跳过假值，和处理0一样，但是避免了NaN if (arguments[i]) {
        sum += arguments[i];
    }
}
    return sum == 1;
}
var a = true;
var b = false;
onlyOne( b, a );// true
onlyOne( b, a, b, b, b );// true
onlyOne( b, b );                // false
onlyOne( b, a, b, b, b, a );    // false

```
### ||和&&
&& 和 || 运算符的返回值并不一定是布尔类型，而是两个操作数其中一个的值。|| 和 && 首先会对第一个操作数(a 和 c)执行条件判断，如果其不是布尔值(如上例)就 先进行 ToBoolean 强制类型转换，然后再执行条件判断。

>既然返回的不是true和false，为什么a && (b || c)这样的表达式在 if 和 for 中没出过问题?
这或许并不是代码的问题，问题在于你可能不知道这些条件判断表达式最后还会执行布尔 值的隐式强制类型转换。
```js
var a = 42;
var b = null;
var c = "foo";
if (a && (b || c)) {
    console.log( "yep" );
}
```
这里a && (b || c)的结果实际上是"foo"而非true，然后再由if将foo强制类型转换为
布尔值，所以最后结果为 true。

## 宽松相等和严格相等
== 允许在相等比较中进行强制类型转换，而 === 不允许。
:::tip
== 和 === 都会检查操作数的类型。区别在于操作数类型不同时它们的处理方式不同。
:::

### "=="
1. 字符串和数字
```js
var a = 42;
var b = "42";
a === b;    // false
a == b;     // true
```
:::tip
把是字符串类型的一边转换成数字类型
:::

2. 其他类型和布尔值
```js
var a = "42";
var b = true;
a == b; // false
```
:::tip
把布尔值转换成数字类型
:::
Type(x)是布尔值，所以ToNumber(x)将true强制类型转换为1，变成1 == "42"，二者的
类型仍然不同，"42" 根据规则被强制类型转换为 42，最后变成 1 == 42，结果为 false。

应该避免写== true  == false

3. null和undefined
在 == 中 null 和 undefined 相等(它们也与其自身相等)，除此之外其他值都不存在这种
情况。
```js
a == b;     // true
a == null;  // true
b == null;  // true
a == false; // false
b == false; // false
a == "";// false
b == "";// false
a == 0;// false
b == 0;// false
```

4. 对象和非对象
```js
var a = 42;
var b = [ 42 ];
a == b; // true
```
:::tip
把对象（对象/数组/函数）进行ToPrimitive(...）再进行比较
:::

```js
var a = 'abc'
var b = Object(a) //和new String()一样

a === b //false
a == b  //true
```
a == b结果为true，因为b通过ToPromitive进行强制类型转换(也称为“拆封”，英文为 unboxed 或者 unwrapped)，并返回标量基本类型值 "abc"，与 a 相等。

```js
ar a = null;
var b = Object( a );// 和Object()一样 
a == b;// false
var c = undefined;
var d = Object( c );// 和Object()一样 
c == d;// false
var e = NaN;
var f = Object( e );// 和new Number( e )一样 
e == f;// false

```
因为没有对应的封装对象，所以 null 和 undefined 不能够被封装(boxed)，Object(null) 和 Object() 均返回一个常规对象。
NaN能够被封装为数字封装对象，但拆封之后NaN == NaN返回false，因为NaN不等于NaN

### 一些不常见的情况
1. 返回其他数字
```js
Number.prototype.valueOf = function() {
    return 3;
};
new Number( 2 ) == 3;   // true

```
:::tip
ToPrimitive
:::

2. 假值的相等比较
```js
"0" == null; //false
"0" == undefined;//false
"0" == false;//true
"0" == NaN;//false
"0" == 0;//true
"0" == "";//false
false == null;//false
false == undefined;//false
false == NaN;//false
false == 0;//true
false == "";//true  记住!!
false == [];//true [].toString() 是“”
false == {};//false
"" == null;//false
"" == undefined;//false
"" == NaN;//false
"" == 0;//true
"" == [];//true
"" == {};//false
0 == null;//false
0 == undefined;//false
0 == NaN;//false
0 == [];//true
0 == {};//false
// false
// false
// true -- 晕! // false
// true
// false
// false
// false
// false
// true -- 晕! // true -- 晕! // true -- 晕! // false
// false
// false
// false
// true -- 晕! // true -- 晕! // false
// false
// false
// false
// true -- 晕! // false
```

```js
[] == ![] // true
```
:::tip
非严格模式下0  空字符串  false 归为一类，称为"假值"，null和undefined归为一类，称为"空值"
:::
根据 ToBoolean 规则，它会进行布尔 值的显式强制类型转换(同时反转奇偶校验位)。所以[] == ![]变成了[] == false。前 面我们讲过 false == []，最后的结果就顺理成章了。

> • 如果两边的值中有 true 或者 false，千万不要使用 ==。
>
> • 如果两边的值中有 []、"" 或者 0，尽量不要使用 ==。
>
> 这时最好用 === 来避免不经意的强制类型转换。这两个原则可以让我们避开几乎所有强制 类型转换的坑。

特别注意0 == “” 是true的情况
```js
function doSomething(a) {
    if (a == "") { //这里a传入0时容易出问题
    }
}
:::tip
• 如果两边的值中有 true 或者 false，千万不要使用 ==。
• 如果两边的值中有 []、"" 或者 0，尽量不要使用 ==。
:::
```
## 抽象关系比较
:::tip
a < b 中涉及的隐式强制类型转换不太引人注意
:::

比较双方首先调用 ToPrimitive，如果结果出现非字符串，就根据 ToNumber 规则将双方强制类型转换为数字来进行比较。
```js
var a = [ 42 ];
var b = [ "43" ];
a < b;  // true
b < a;  // false
```
如果比较双方都是字符串，则按字母顺序来进行比较:
```js
var a = [ "42" ];
var b = [ "043" ];
a < b; // false

var a = [ 4, 2 ];
var b = [ 0, 4, 3 ];
a < b; // false

var a = { b: 42 };
var b = { b: 43 };
a < b;  // false
a == b; // false
a > b;  // false
a <= b; // true
a >= b; // true
```
a 和 b 并没有被转换为数字，因为 ToPrimitive 返回的是字符串，所以这里比较的是 "42" 和 "043" 两个字符串，它们分别以 "4" 和 "0" 开头。因为 "0" 在字母顺序上小于 "4"，所以 最后结果为 false。

a 转换为 "4, 2"，b 转换为 "0, 4, 3"，同样是按字母顺序进行比较。

:::tip
注意: 根据规范a <= b被处理为b < a，然后将结果反转。因为b < a的结果是false，所
以 a <= b 的结果是 true  即 a >= b，处理为 !(b < a))
:::


