const fs = require('fs');

const rs = fs.createReadStream('./files/lorem.txt', 'utf8');
const ws = fs.createWriteStream('./files/loremcopy.txt');

// rs.on('data', (chunk) =>{
// 	ws.write(chunk)
// })


rs.pipe(ws)