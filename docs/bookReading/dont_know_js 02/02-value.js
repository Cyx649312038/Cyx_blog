var a = []
a[0] = 1
a['foo'] = 2
console.log(a.length);
console.log(a['foo'], a.foo);


console.log(0.1 + 0.2); //0.30000000000000004
console.log('能呈现的最大浮点数',Number.MAX_VALUE);
console.log('能呈现的最小浮点数',Number.MIN_VALUE);
console.log('能呈现的最大整数',Number.MAX_SAFE_INTEGER);
console.log('能呈现的最小整数',Number.MIN_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER.toExponential());

console.log(Number.isInteger(42.0));
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1 ));

console.log(1/0, -1/0);  //Infinity, -Infinity

console.log(0 / -3); // -0

console.log(NaN === NaN); //false

console.log(Object.is(true,'foo'));