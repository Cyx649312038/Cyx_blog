function f1(obj: { x: number, y?: string }) {
    console.log('?可选参数 测试');
    console.log(obj.y?.toUpperCase());  //可选链操作符

}
f1({ x: 1 })
