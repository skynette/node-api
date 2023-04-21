const os = require("os")
const path = require("path")
const { add, subraction, multiply, divide } = require("./math")

// console.log(os.homedir())
// console.log(os.type())
// console.log(__dirname)
// console.log(__filename)

// console.log(path.dirname(__filename))
// console.log(path.basename(__filename))
// console.log(path.extname(__filename))

// console.log(path.parse(__filename))
// const { root, dir, base, ext, name } = path.parse(__filename)
// console.log(root, dir, base, ext, name)

console.log(add(1, 2))
console.log(subraction(1, 2))
console.log(multiply(1, 2))
console.log(divide(1, 2))