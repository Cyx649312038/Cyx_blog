type obj = {
    x: number,
    y: number
}

function f3(obj: obj) {

}
f3({
    x: 100,
    y: 200
})

type id = number | string
function f4(id: id) {

}
f4(111)

type returnType = number | string
function f5(id: id): returnType {
    return id
}
f5(1111)

