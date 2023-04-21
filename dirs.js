const fs = require('fs')

if (!fs.existsSync('./newDir')) {
	fs.mkdir('./newDir', (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Directory created');
		}
	})
}

if (fs.existsSync('./newDir')) {
	fs.rmdirSync('./newDir', (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Directory deleted');
		}
	})
}
