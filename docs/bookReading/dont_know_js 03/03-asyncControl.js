Promise.reject(new Promise((resolve, reject) => {
    reject('错误')
} )).then((value) => {
    console.log('value',value);
}, (err) => {
    console.log('err',err); //Promise { <rejected> '错误' }
})