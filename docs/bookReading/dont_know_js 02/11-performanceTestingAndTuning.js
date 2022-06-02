var Benchmark = require('./benchmark') 
function foo() {
    var x = 1
    x++
    console.log(x);
    x--
    x = x + 3
    for(var i = 0; i< 10000000; i++) {
        
    }
    setTimeout(() => {
        console.log(111);
    }, 1000)
}
var bench = new Benchmark('foo test', foo)
console.log(bench.hz);
console.log(bench.stats.moe);
console.log(bench.stats.variance);