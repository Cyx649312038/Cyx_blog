function foo(str, a) { 
    // eval( str ); // 欺骗! 
    console.log( a, b );
}
var b = 2;
foo( "var b = 3;", 1 ); // 1, 3



function test() {
    a = 2  
}
test()
console.log(a); //2