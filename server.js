const express = require("express")

const app = express()
const path = require('path');
const cors = require("cors")
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger)

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
app.use(cors(corsOptions))

// built in middleware to hanlde urlencoded data
app.use(express.urlencoded({ extended: false }))

// built in middleware for json
app.use(express.json())

// built in middleware for static files
app.use(express.static(path.join(__dirname, "/public")))
app.use('/subdir', express.static(path.join(__dirname, "/public")))

app.use("/", require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))


// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
	console.log("ATtempted to load hello html");
	next()
}, (req, res) => {
	res.send("hello world")
})

app.all("*", (req, res) => {
	res.status(404)
	if (req.accepts('html')){
		res.sendFile(path.join(__dirname, "views", "404.html"))
	} else if (req.accepts('json')){
		res.json({error: "404 not found"})
	} else {
		res.type('txt').send("404 not found")
	}
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));