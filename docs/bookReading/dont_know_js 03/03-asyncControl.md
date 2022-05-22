## Promise
更详细的promise的使用方法可以看你不知道的js(中)的部分
### 构造和使用Promise
* 如果调用 reject(..)，这个 promise 被拒绝，如果有任何值传给 reject(..)，这个值就 被设置为拒绝的原因值。
* 如果调用 resolve(..) 且没有值传入，或者传入任何非 promise 值，这个 promise 就完成。
* 如果调用 resove(..) 并传入另外一个 promise，这个 promise 就会采用传入的 promise
的状态(要么实现要么拒绝)——不管是立即还是最终。

### thenable
Promise(..) 构造器的真正实例是 Promise。但还有一些类 promise 对象，称为 thenable，
一般来说，它们也可以用 Promise 机制解释。

任何提供了 then(..) 函数的对象(或函数)都被认为是 thenable。Promise 机制中所有可
以接受真正 promise 状态的地方，也都可以处理 thenable。

```js
var th = {
    then: function thener( fulfilled ) {
        // 每100ms调用一次fulfilled(..)，直到永远
        setInterval( fulfilled, 100 );
    }
};
```
如果接收到了这个 thenable，并通过 th.then(..) 把它链接起来，很可能你会吃惊地发现自己的完成处理函数会被重复调用，而正常的 Promise 应该只会决议一次。

一般来说，如果从某个其他系统接收到一个自称 promise 或者 thenable 的东西，不应该盲 目信任它。在下一小节中，我们会介绍一个 ES6 Promise 包含的工具，用来帮助解决这个 信任问题。

### Promise api

> Promise.reslove()

Promise.resolve(..) 创建了一个决议到传入值的 promise。我们把它的工作机制与手动方法对比一下:
```js

var p1 = Promise.resolve( 42 );
var p2 = new Promise( function pr(resolve){
    resolve( 42 );
} );

var theP = ajax( .. );
var p1 = Promise.resolve( theP );
var p2 = new Promise( function pr(resolve){
    resolve( theP );
} );
```
Promise.resolve(..) 是一个针对上一小节中介绍的 thenable 信任问题的解 决方案。对于任何还没有完全确定是可信 promise 的值，甚至它可能是立即 值，都可以通过把它传给 Promise.resolve(..) 来规范化。如果这个值已经 是可以确定的 promise 或者 thenable，它的状态 / 决议就会被直接采用，这 样会避免出错。而如果它是一个立即值，那么它会被“封装”为一个真正的 promise，这样就把它的行为方式规范为异步的。
比如上面说的自己的完成处理函数会被重复调用，而正常的 Promise 应该只会决议一次这个问题。

> Promise.reject()

Promise.reject(..)也一样但是有一个很重要的区别:

resolve(..) 和 Promise.resolve(..) 可以接受 promise 并接受它的状态 / 决议，而 reject (..) 和 Promise.reject(..) 并不区分接收的值是什么。所以，如果传入 promise 或 thenable 来拒绝， 这个 promise / thenable 本身会被设置为拒绝原因，而不是其底层值。

> Promise.all()

Promise.all([ .. ]) 接受一个或多个值的数组(比如，立即值、promise、thenable)。它返 回一个 promise，如果所有的值都完成，这个 promise 的结果是完成;一旦它们中的某一个 被拒绝，那么这个 promise 就立即被拒绝。

Promise.all([ .. ])等待所有都完成(或者第一个拒绝)，

> Promise.race()

Promise.race([ .. ])等待 第一个完成或者拒绝

:::tip
Promise.all([]) 将会立即完成(没有完成值)，Promise.race([]) 将会永远挂起。这是一个很奇怪的不一致，因此我建议，永远不要用空数组使用这些方法
:::

## 生成器+Promise
```js
function *main() {
    var ret = yield step1();
    try {
        ret = yield step2( ret );
    }
    catch (err) {
        ret = yield step2Failed( err );
    }
    ret = yield Promise.all( [
        step3a( ret ),
        step3b( ret ),
        step3c( ret )
    ] );
    yield step4( ret );
}



function run(gen) {
    var args = [].slice.call( arguments, 1), it;
    it = gen.apply( this, args );
    return Promise.resolve()
        .then( function handleNext(value){
            var next = it.next( value );
            return (function handleResult(next){
                if (next.done) {
                    return next.value;
                }
                else {
                    return Promise.resolve( next.value )
                        .then(
                            handleNext,
                            function handleErr(err) {
                                return Promise.resolve(
                                    it.throw( err )
                                )
                                .then( handleResult );
                            }
                        ); 
                }
            })( next );
        } )
}

run(main)
```