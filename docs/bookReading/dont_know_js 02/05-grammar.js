var a = 42
var b = a++
console.log(b,a); //42

var c = 0
console.log(++c); //1
console.log(c); //1
console.log(c++);//1
console.log(c);//2

console.log({"a": 3})

console.log({} + []);
console.log([] + {});

function f1(a,b,c) {
    console.log(arguments);
}
f1(1,2,3)

try {
    // app =
    console.log(app);
} catch(err) {
    console.log('error', err);
}