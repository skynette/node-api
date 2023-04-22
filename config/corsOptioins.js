
// cross origin resource sharing third party middleware
const whitelist = ['https://www.example.com', 'http://127.0.0.1:3000', 'http://localhost:3500']
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			callback(new Error("Not allowed by CORS"))
		}
	},
	optionsSuccessStatus: 200
}

module.exports = corsOptions