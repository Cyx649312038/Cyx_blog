// var p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步一')
//     }, 1000)
// })
// var p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步二')
//     }, 2000)
// })
// var p3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步三')
//     }, 3000)
// })
// Promise.any([p1,p2,p3]).then((msgs) => {
//     console.log('all msgs', msgs);  //all msgs [ '异步一', '异步二', '异步三', '立即值' ]
// },(err) => {
//     console.log('all error', err);
// })


// new Promise((resolve, reject) => {
//     resolve(new Promise((resolve, reject) => {
//         resolve(1111)
//     }))
// }).then((value) => {
//     console.log(value);
// })

// new Promise((resolve, reject) => {
//     // reject('拒绝')
//     foo.bar()
// }).then((value) => {
//     console.log(value);
//     car.foo()
// }).then((value) => {}, (err) => {
//     console.log('error',err);
// })
Promise.resolve(new Promise((reslove,reject) => {
    setTimeout(reslove.bind(this,'测试一下'),1000)
    
})).then(value => {
    console.log('value',value);
})