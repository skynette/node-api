const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async () => {
	try {
		data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
		console.log(data);
		await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'));
		await fsPromises.appendFile(path.join(__dirname, 'files', 'promisewrite.txt'), "\n\n\tNice to meet you too");
		await fsPromises.appendFile(path.join(__dirname, 'files', 'promisewrite.txt'), "\n\n\tNice to meet you too");
		await fsPromises.rename(path.join(__dirname, 'files', 'promisewrite.txt'), path.join(__dirname, 'files', 'Newpromisewrite.txt'));
		newData = await fsPromises.readFile(path.join(__dirname, 'files', 'Newpromisewrite.txt'), 'utf8');
		console.log(newData);
	} catch (error) {
		console.log(error);
	}
}

fileOps();


// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), "nice to meet you", (err) => {
// 	if (err) throw err;
// 	console.log('File was written');
	
// 	fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), "\n\n\tnice to meet you too", (err) => {
// 		if (err) throw err;
// 		console.log('File was appended');

// 		fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'Newreply.txt'), (err) => {
// 			if (err) throw err;
// 			console.log('Renaned file');
// 		});
// 	});
// });


process.on('uncaughtException', (err) => {
	console.log(err);
	process.exit(1)
});