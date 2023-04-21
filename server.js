const logEvents = require('./logEvents');

const eventEmitter = require('events')

class MyEmitter extends eventEmitter {};

// initialize the object
const myEmitter = new MyEmitter();

// add listener for log event
myEmitter.on('log', (message) => {
	logEvents(message);
});

// setTimeout(() => {
// 	// emit log event
// 	myEmitter.emit('log', 'Log event emitted');
// }, 2000);