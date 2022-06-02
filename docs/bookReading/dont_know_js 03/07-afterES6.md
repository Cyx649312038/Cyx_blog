## 异步函数
>async function

我们提到了一个关于直接在语法上支持这个模式的提案:生成器向类似运行 器的工具 yield 出 promise，这个运行器工具会在 promise 完成时恢复生成器。让我们来简 单了解一下这个提案提出的特性 async function。

```js
run( function *main() {
    var ret = yield step1();
    try {
        ret = yield step2( ret );
    }
    catch (err) {
        ret = yield step2Failed( err );
    }
    ret = yield Promise.all([
        step3a( ret ),
        step3b( ret ),
        step3c( ret )
    ]);
    yield step4( ret ); })
.then(
    function fulfilled(){
    // *main()成功完成 
    },
    function rejected(reason){ // 哎呀，出错了
    } 
);
```

提案的async function语法不需要run(..)工具就可以表达同样的流控制逻辑，因为 JavaScript 将会自动了解如何寻找要等待和恢复的 promise。
```js
async function main() {
    var ret = await step1();
    try {
        ret = await step2( ret );
    }
    catch (err) {
        ret = await step2Failed( err );
    }
    ret = await Promise.all( [
        step3a( ret ),
        step3b( ret ),
        step3c( ret )
    ] );
    await step4( ret );
}
main().then(
    function fulfilled(){ 
        // main()成功完成
    },
    function rejected(reason){
        // 哎呀，出错了 
    }
);
```
我们没有使用 function *main() {.. 声明，而是使用了 async function main() {.. 形式。 而且，没有 yield 出一个 promise，而是 await 这个 promise。调用来运行函数 main() 实际 上返回了一个可以直接观察的 promise。这和从 run(main) 调用返回的 promise 是等价的。

:::tip
看到这种对称性了吗?async function本质上就是生成器+promise+run(..)模式的语 法糖;它们底层的运作方式是一样的!
:::

async function 有一个没有解决的问题，因为它只返回一个 promise，所以没有办法从外部 取消一个正在运行的async function实例。如果这个异步操作的资源紧张，那么可能会引 起问题，因为一旦你确认不需要结果就会想要释放资源。

## Object.observe()
目前api好像已经被废弃
```js
var obj = { a: 1, b: 2 };
    Object.observe(
        obj,
        function(changes){
            for (var change of changes) {
                console.log( change );
            }
},
        [ "add", "update", "delete" ]
    );
    obj.c = 3;
    // { name: "c", object: obj, type: "add" }
    obj.a = 42;
    // { name: "a", object: obj, type: "update", oldValue: 1 }
    delete obj.b;
    // { name: "b", object: obj, type: "delete", oldValue: 2 }
```
### 自定义改变事件
```js
function observer(changes){
    for (var change of changes) {
        if (change.type == "recalc") {
            change.object.c =
                change.object.oldValue +
                change.object.a +
                change.object.b;
        } 
    }
}

function changeObj(a,b) {
    var notifier = Object.getNotifier( obj );
    obj.a = a * 2;
    obj.b = b * 3;
    // 把改变事件排到一个集合中 
    notifier.notify( {
        type: "recalc",
        name: "c",
        oldValue: obj.c
    } )
}
var obj = { a: 1, b: 2, c: 3 };
Object.observe(
    obj,
    observer,
    ["recalc"]
);
changeObj( 3, 11 );
obj.a; // 12
obj.b; // 30
obj.c; // 3
```

## 幂运算符
```js
var a = 2;
a ** 4;  // Math.pow( a, 4 ) == 16
a **= 3; // a = Math.pow( a, 3 )
a;       // 8
```

## 对象属性与 ...
```js
var o1 = { a: 1, b: 2 },
    o2 = { c: 3 },
    o3 = { ...o1, ...o2, d: 4 };
console.log( o3.a, o3.b, o3.c, o3.d ); // 1 2 3 4

// ... 运算符可能也会用于把对象的解构属性收集到一个对象: var o1 = { b: 2, c: 3, d: 4 };
var { b, ...o2 } = o1;
console.log( b, o2.c, o2.d );     // 2 3 4
```

## Array#includes(...)
```js
var arr = [1,2,3,4]
console.log(arr.includes(2));  //true
```