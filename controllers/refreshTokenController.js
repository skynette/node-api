const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}


const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRereshToken = (req, res) => {
	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(401)

	const refreshToken = cookies.jwt;

	const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken);
	if (!foundUser) return res.status(401).json({ 'error': 'Invalid refresh token' }); //forbidden

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err|| foundUser.username !== decoded.username) return res.status(403).json({ 'error': 'Invalid refresh token' }); //forbidden
			const accessToken = jwt.sign(
				{ username: decoded.username },
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '30s' }
			)
			res.json({ accessToken });
		}
	)
}

module.exports = { handleRereshToken };