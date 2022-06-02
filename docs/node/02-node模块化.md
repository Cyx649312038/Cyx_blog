## Node模块化理解
Node.js采用的是CommonJs规范，在NodeJS中，一般将代码合理拆分到不同的JS文件中，每一个文件就是一个模块，而文件路径就是模块名。
在编写每个模块时，都有require、exports、module三个预先定义好的变量可供使用。
> Node.js中模块的分类：
* 核心模块（已经封装好的内置模块
* 自己定义的模块
* 第三方的模块（npm下载下来的

### require
require函数用来在一个模块中引入另外一个模块。传入一个模块名，返回一个模块导出对象。用法：let cc = require("模块名") ，其中模块名可以用绝对路径也可以用相对路径,模块的后缀名.js可以省略。例如：
```js
let cc1 = require('./main.js')
let cc2 = require('home/src/main.js')
let cc3 = require('./main')
```
require()函数用两个作用：
* 执行导入的模块中的代码；
* 返回导入模块中的接口对象；

### exports
exports对象用来导出当前模块的公共方法或属性，别的模块通过require函数使用当前模块时得到的就是当前模块的exports对象。用法：exports.name,name为导出的对象名。例子：

```js
exports.add = function () {
  let i = 0
  console.log(++i)
}
​
// 导出一个add方法供其他模块使用
```
> 其实exports类似于ES6中的export的用法，用来导出一个指定名字的对象

### module.exports
module.exports用来导出一个默认对象，没有指定对象名，常见于修改模块的原始导出对象。比如原本模块导出的是一个对象，我们可以通过module.exports修改为导出一个函数。如下：

```js
module.exports = function () {
  console.log('hello world！')
}
```

### 模块初始化
一个模块中的JS代码仅在模块第一次被使用时执行一次，并且在使用的过程中进行初始化，之后缓存起来便于后续继续使用

### 主模块
通过命令行参数传递给NodeJS以启动程序的模块被称为主模块。主模块负责调度组成整个程序的其它模块完成工作。例如通过以下命令启动程序时，main.js就是主模块
```js
$ node main.js // 运行main.js启动程序，main.js称为主模块
```

## Node中exports 和 module.exports的区别
Node中，每个模块都有一个exports接口对象，我们需要把公共的方法或者字符串挂载在这个接口对象中，其他的模块才可以使用。
> Node.js中只有模块作用域，默认两个模块之间的变量，方法互不冲突，互不影响，这样就导致一个问题，我们怎样使用加载进来的模块中的方法呢？这就需要在另外一个模块exports接口对象中挂载模块中公共的方法。

### exports
我们在a.js中有以下代码：
```js
let foo = 'hello'
function add (x, y) {
  return x+y
}
exports.add = add // 在接口对象中挂载公共的add方法
exports.foo = foo // 在接口对象中挂载foo属性
```
此时，在b.js中如果需要使用add方法,只需引入a.js即可。b.js代码如下
```js
let a = require('./a.js')  // a.js和b.js在同级目录下，注意：同级目录必须加“./”
​
console.log(a.add(20,30)) // 使用a.js中的add方法
```

### module.exports
对于1中的例子，我们同样可以利用module.exports来写，只需把暴露的方式改成如下：
```js
module.exports.add = add  
​
module.exports.foo = foo
```

### 总结
1. Node中每个模块都有一个module对象，module对象中的有一个exports属性为一个接口对象，我们需要把模块之间公共的方法或属性挂载在这个接口对象中，方便其他的模块使用这些公共的方法或属性。
2. Node中每个模块的最后，都会return: module.exports。
3. Node中每个模块都会把module.exports指向的对象赋值给一个变量exports，也就是说：exports = module.exports。
4. module.exports = XXX，表示当前模块导出一个单一成员，结果就是XXX。
5. 如果需要导出多个成员时必须使用exports.add = XXX; exports.foo = XXX;或者使用module.exports.add = XXX; module.export.foo = XXX;。


## Node中加载第三方包的规则
Node.js中使用CommonJs模块化机制，通过npm下载的第三方包，我们在项目中引入第三方包都是：let xx = require('第三方包名')，究竟require方法加载第三方包的原理机制是什么，今天我们来探讨下。‘
1. require('第三方包名')优先在加载该包的模块的同级目录node_modules中查找第三方包。
```js
let template = require('art-template') //加载第三方包
```

2. 找到该第三方包中的package.json文件，并且找到里面的main属性对应的入口模块，该入口模块即为加载的第三方模块。

3. 如果在要加载的第三方包中没有找到package.json文件或者是package.json文件中没有main属性，则默认加载第三方包中的index.js文件。

4. 如果在加载第三方模块的文件的同级目录没有找到node_modules文件夹，或者以上所有情况都没有找到，则会向上一级父级目录下查找node_modules文件夹，查找规则如上一致。

5. 如果一直找到该模块的磁盘根路径都没有找到，则会报错：can not find module xxx。