new Promise((resolve, reject) => {
resolve(1111,222,333)
}).then((value) => {
    console.log('value',value);
})
console.log(222);

// 222   value 111


const p =new Promise((resolve, reject) => {
    resolve(111)
})
p.then(() => {
    p.then(() => {
        console.log('C');
    })
    console.log('A');
})
p.then(() => {
    console.log('B');
})
// A  B  C

new Promise((resolve, reject) => {
    console.log(cyx);
    resolve(111)
}).then((succ) => {console.log('succ',succ)}, (err) => {
    console.log('err',err)
})

new Promise((resolve, reject) => {
    resolve(111)
}).then(
    (succ) => {
    // console.log(cyx);
    console.log('succ',succ)
}, 
    (err) => {
        console.log('err',err)
    })


    var p1 = {
        then: function(cb,errcb) {
            cb( 42 );
            errcb( "evil laugh" );
        }
    };
    Promise.resolve( p1 )
    .then(
        function fulfilled(val){
            console.log( val ); // 42
        },
        function rejected(err){
    // 永远不会到达这里 
}
)


new Promise((resolve, reject) => {
    var a 
    setTimeout(() => {
        a = 'cyx-111';
        // resolve(a)
    }, 2000)
    resolve(a)
    
}).then((value) => {
    console.log('yibutest1', value); //undefined
})



new Promise((resolve, reject) => {
    // var a =2
    // return new Promise((resolve, reject) => {
    //     // setTimeout(() => {
    //     //     a = 'cyx-111';
    //     //     // resolve(a)
    //     // }, 2000)
    //     resolve(a * 2)
    // })
    resolve(2)
    
    
}).then((value) => {
    console.log('yibutest2', value); //undefined
    return new Promise((resolve, reject) => {
            // setTimeout(() => {
            //     a = 'cyx-111';
            //     // resolve(a)
            // }, 2000)
            resolve(value * 2)
        })
}).then((value) => {
    console.log('yibutest3', value); //4
})



new Promise((resolve, reject) => {
    
    setTimeout(() => {
        resolve('yibutest4')
    }, 2000)
    
}).then((value) => {
    console.log('yibutest4', value);
    setTimeout(() => {
        return 'yibutest5'
    }, 2000)
}).then((value) => {
    console.log('yibutest5', value); //undefined
})



new Promise((resolve, reject) => {
    
    setTimeout(() => {
        resolve('yibutest6')
    }, 2000)
    
}).then((value) => {
    console.log('yibutest6', value);
    return new Promise((resolve, reject) => {
        
        setTimeout(() => {
            resolve('yibutest7')
        }, 2000)
        
    })
}).then((value) => {
    console.log('yibutest7', value); //yibutest7
})


new Promise((resolve, reject) => {
    resolve(1)
}).then((value)=>{
    foo.bar()
    return 'success'
}).then((value) => {
    console.log('err test value', value);
}).then(() => {}, (err) => {
    console.log('err test2 value', err);
})

new Promise((resolve, reject) => {
    resolve(Promise.resolve('reslove 传入promise测试')
    )
}).then((value) => {
    console.log('reslove 传入promise测试', value);
})


    //  Promise-aware ajax
    //  function request(url) {
    //     return new Promise( function(resolve,reject){
    //     // ajax(..)回调应该是我们这个promise的resolve(..)函数 
    //     ajax( url, resolve );
    //     } ); }
    //          request( "http://some.url.1/" )
    //          .then( function(response1){
    //     return request( "http://some.url.2/?v=" + response1 ); })
    //          .then( function(response2){
    //              console.log( response2 );
    //     } );


// function foo() {
//     setTimeout( function(){
//         baz.bar();
//     }, 100 );
// }
// try {
//     foo();
// // 后面从 `baz.bar()` 抛出全局错误 
// }
// catch (err) {
//     console.log('error', err);
// // 永远不会到达这里
// }


var p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步一')
    }, 1000)
})
var p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步二')
    }, 2000)
})
var p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步三')
    }, 3000)
})
Promise.all([p1,p2,p3,'立即值']).then((msgs) => {
    console.log('all msgs', msgs);  //all msgs [ '异步一', '异步二', '异步三', '立即值' ]
})


// var p4 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步四')
//         reject('错误四')
//     }, 1000)
// })
// var p5 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步五')
//         reject('错误五')
//     }, 2000)
// })
// var p6 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('异步六')
//         reject('错误六')
//     }, 3000)
// })
// Promise.all([p4,p5,p6,'立即值']).then((msgs) => {
//     console.log('all msgs', msgs);  //all msgs [ '异步一', '异步二', '异步三', '立即值' ]
// },(error) => {
//     console.log('error--all', error);
// })


var p4 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步四')
    }, 2000)
})
var p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步五')
    }, 1000)
})
var p6 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步六')
    }, 3000)
})
Promise.race([p4,p5,p6]).then((msgs) => {
    console.log('race msgs', msgs);  //race msgs 异步五
},(error) => {
    console.log('error--race', error);
})

