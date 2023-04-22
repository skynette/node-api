const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401)
	const token = authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ 'error': 'Missing token' });
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, decoded)=>{
			if (err) return res.status(403).json({ 'error': 'Invalid token' });
			req.user = decoded.UserInfo.username;
			req.roles = decoded.UserInfo.roles;
			next();
		}
	)
}

module.exports = { verifyJWT };