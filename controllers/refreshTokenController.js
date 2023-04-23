const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRereshToken = async (req, res) => {
	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(401)

	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	if (!foundUser) return res.status(401).json({ 'error': 'Invalid refresh token' }); //forbidden

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err || foundUser.username !== decoded.username) return res.status(403).json({ 'error': 'Invalid refresh token' }); //forbidden
			const roles = Object.values(foundUser.roles)
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: decoded.username,
						roles: roles
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '30s' }
			)
			res.json({ accessToken });
		}
	)
}

module.exports = { handleRereshToken };