const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement
const myCanvas2 = <HTMLCanvasElement>document.getElementById('main_canvas')

let x = ('hello' as unknown) as number
// x = '111' //不能将类型“string”分配给类型“number”。  