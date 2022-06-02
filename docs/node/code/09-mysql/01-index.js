let mysql = require('mysql')
let option = {
    host: "localhost",
    port: "3306", //默认就是3306可选设置
    user: "root",
    password: "cyx123456",
    database: "user"
}

// 创建与数据库的连接对象
let con = mysql.createConnection(option)
// 建立连接
con.connect(err => {
    if(err) {
        console.log('error',err);
    } else {
        console.log('连接数据库成功!');
    }
})

// sql语句

// // 查询
// let strSql = "select * from friends"
// con.query(strSql,(err,results,fields) => {
//     console.log('error', err);
//     console.log('results', results);
//     console.log('fields', fields);
// })
// // 删除表
// let strSql2 = "drop table friends"
// con.query(strSql2, (err,results) => {
//     console.log('error', err);
//     console.log('results', results);
// })

// // 删库
// let strSql3 = "drop database user"
// con.query(strSql3, (err,results) => {
//     console.log('error', err);
//     console.log('results', results);
// })

// 创建库
// let strSql4 = "create database user"
// con.query(strSql4, (err,results) => {
//     console.log('error', err);
//     console.log('results', results);
// })

// 建表
// let strSql5 = `CREATE TABLE users(
//     ALTER TABLE `user`.`users` 
//     ADD COLUMN `id` int NOT NULL AUTO_INCREMENT FIRST,
//     ADD COLUMN `name` varchar(255) NULL AFTER `id`,
//     ADD COLUMN `age` int NULL AFTER `name`,
//     ADD COLUMN `gender` varchar(255) NULL AFTER `age`,
//     DROP PRIMARY KEY,
//     ADD PRIMARY KEY (`id`, `id`) USING BTREE;
// )`

// 插入数据
let strSql6 = "insert into users (name,gender,age) values('cjx', '男', 24)"
con.query(strSql6, (err,results) => {
    console.log('error', err);
    console.log('results', results);
})

// 动态添加
let strSql7 =  "insert into users (name,gender,age) values(?, ?, ?)"
con.query(strSql7, ["tzq","女","42"] ,(err,results) => {
    console.log('error', err);
    console.log('results', results);
})