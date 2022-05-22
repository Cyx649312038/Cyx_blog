// var buf = new ArrayBuffer(32)
// console.log(buf.byteLength); //32

const { map } = require("cheerio/lib/api/traversing")

// var arr = new Uint16Array(buf)
// console.log(arr.length);  //16
// for(var i = 0; i< arr.length; i++ ){
//     console.log(arr[i]);
// }

// var m = new Map()
// var x = {id: 1}
// var y = {id: 2}
// m.set(x, "foo")
// m.set(y, "bar")
// console.log(m.get(x), m.get(y));// "foo"  "bar"
// m.delete(y)
// console.log(m,m.get(y)); //{ { id: 1 } => 'foo' } undefined
// m.clear()
// console.log(m, m.get(x)); //Map(0) {} undefined
// console.log(m.size); //0


// var m = new Map()
// m.set({id:1}, 1)
// m.set({id:2}, 2)
// console.log(m.entries()); //{ [ { id: 1 }, 1 ], [ { id: 2 }, 2 ] }
// var m2 = new Map(m.entries())
// console.log(m2); //{ { id: 1 } => 1, { id: 2 } => 2 }
// var m3 = new Map(m2)
// console.log(m3); //{ { id: 1 } => 1, { id: 2 } => 2 }


// var x = {id: 1}
// var y = {id: 2}
// var m = new Map([
//     [x,"foo"],
//     [y,"bar"]
// ])
// console.log(m,  m.get(x), m.get(y)); //{ { id: 1 } => 'foo', { id: 2 } => 'bar' } foo bar


// var x = {id: 1}
// var y = {id: 2}
// var m = new Map([
//     [x, "foo"],
//     [y, "bar"]
// ])
// console.log(m.values()); //[Map Iterator] { 'foo', 'bar' }
// var vals = [...m.values()]
// console.log(vals); //[ 'foo', 'bar' ]
// console.log(Array.from(m.values())); //[ 'foo', 'bar' ]


// var m = new Map();
// var x = { id: 1 },
//     y = { id: 2 };
// m.set( x, "foo" );
// m.set( y, "bar" );
// var vals = [ ...m.entries() ];
// vals[0][0] === x; // true
// vals[0][1];  // "foo"
// vals[1][0] === y;  // true
// vals[1][1];  // "bar"


var s = new Set()
var x = {id: 1}
var y = {id: 2}
s.add(x)
s.add(y)
console.log(s, [...s]); //Set(2) { { id: 1 }, { id: 2 } } [ { id: 1 }, { id: 2 } ]
console.log('keys',s.keys(),'values', s.values(), 'entries', s.entries());  //keys [Set Iterator] { { id: 1 }, { id: 2 } } values [Set Iterator] { { id: 1 }, { id: 2 } }  entries [Set Entries] { [ { id: 1 }, { id: 1 } ], [ { id: 2 }, { id: 2 } ] }









