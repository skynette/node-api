const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');

const eventEmitter = require('events')

class Emitter extends eventEmitter {};

// initialize the object
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
	console.log('Request for: ' + req.url);
	console.log('Request method: ' + req.method);
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
















// add listener for log event
// myEmitter.on('log', (message) => {
// 	logEvents(message);
// });

