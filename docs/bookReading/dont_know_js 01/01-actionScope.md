## LHS查询和RHS查询
::: tip
  LHS 和 RHS 的含义是“赋值操作的左侧或右侧”并不一定意味着就是“= 赋值操作符的左侧或右侧”。赋值操作还有其他几种形式，因此在概念上最好将其理解为“赋值操作的目标是谁(LHS)”以及“谁是赋值操作的源头
(RHS)”.

RHS 查询与简单地查找某个变量的值别无二致，而 LHS 查询则是试图 找到变量的容器本身，从而可以对其赋值。从这个角度说，RHS 并不是真正意义上的“赋 值操作的右侧”，更准确地说是“非左侧”。

你可以将 RHS 理解成 retrieve his source value(取到它的源值)，这意味着“得到某某的 值”。

作用域是一套规则，用于确定在何处以及如何查找变量(标识符)。如果查找的目的是对
变量进行赋值，那么就会使用 LHS 查询;如果目的是获取变量的值，就会使用 RHS 查询
:::

例子:
```js
function foo(a) { console.log( a ); // 2
}
foo( 2 );
```
LHS: (a = 2) 隐式 

RHS: a --需要找到这个a并去使用它、  console.log() --需要找到console.log这个api并去使用它
     foo() --需要找到foo这个函数并去调用它

## 作用域链
::: tip
LHS 和 RHS 引用都会在当前楼层进行查找，如果没有找到，就会坐电梯前往上一层楼， 如果还是没有找到就继续向上，以此类推。一旦抵达顶层(全局作用域)，可能找到了你 所需的变量，也可能没找到，但无论如何查找过程都将停止。
:::

## 词法作用域和动态作用域
```js
function foo() { 
  console.log( a ); // 词法作用域：2  动态作用域：3
}
function bar() { 
  var a = 3;
  foo(); 
  }
var a = 2;
bar();

```
词法作用域让 foo() 中的 a 通过 RHS 引用到了全局作用域中的 a，因此会输出 2

而动态作用域并不关心函数和作用域是如何声明以及在何处声明的，只关心它们从何处调 用。换句话说，作用域链是基于调用栈的，而不是代码中的作用域嵌套。

因为当 foo() 无法找到 a 的变量引用时，会顺着调用栈在调用 foo() 的地 方查找 a，而不是在嵌套的词法作用域链中向上查找。由于 foo() 是在 bar() 中调用的， 引擎会检查 bar() 的作用域，并在其中找到值为 3 的变量 a。

:::tip
主要区别:词法作用域是在写代码或者说定义时确定的，而动态作用域是在运行时确定 的。(this 也是!)词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用。
:::

## this同词法作用域的联系

```js
var obj = {
  id: "awesome",
  cool: function coolFn() {
      console.log( this.id );
  } 
};
var id = "not awesome"
obj.cool(); // 酷
setTimeout( obj.cool, 100 ); // 不酷
```
> 因为这了setTimeout的回调的this指向调用者而这里的调用者是window 所以找到了全局的id

看下面几种解决办法：
```js
var obj = { 
  count: 0,
  cool: function coolFn() { 
    var self = this;
    if (self.count < 1) {
    setTimeout( function timer(){ //注意这里用的不是obj.cool了 里面也没有使用this，self 只是一个可以通过 词法作用域和闭包进行引用的标识符
        self.count++;
        console.log( "awesome?" );
    }, 100 );
  } }
};
obj.cool(); // 酷吧?

var obj = { 
  count: 0,
  cool: function coolFn() { 
    if (this.count < 1) { 
      setTimeout( () => { // 箭头函数是什么鬼东西? this.count++; 箭头函数放弃了所有普通this绑定的规则，取而代之的是用当前的词法作用域覆盖了this本来的值
                          // 它的this是当前词法作用域下的this
        console.log( "awesome?" );
      }, 100 );
    } 
  }
};
obj.cool(); // 很酷吧 ?

var obj = { 
  count: 0,
  cool: function coolFn() { 
    if (this.count < 1) {
      setTimeout( function timer(){ 
        this.count++; // this 是安全的 // 因为 bind(..)
        console.log( "more awesome" ); 
        }.bind( this ), 100 ); // look, bind()!
    } 
  }
};
obj.cool(); // 更酷了。
```


