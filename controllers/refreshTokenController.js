const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRereshToken = async (req, res) => {
	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(401)

	const refreshToken = cookies.jwt;
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

	const foundUser = await User.findOne({ refreshToken }).exec();

	// detected refresh token re use
	if (!foundUser){
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) return res.sendStatus(403) //forbidden
				const hackedUser = await User.findOne({ username: decoded.username }).exec();
				hackedUser.refreshToken = [];
				const result = await hackedUser.save();
				console.log(result);
			}
		)
		return res.sendStatus(403) //forbidden
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);
	
	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err){
				foundUser.refreshToken = newRefreshTokenArray;
				result = await foundUser.save();
			}
			if (err || foundUser.username !== decoded.username) return res.status(403).json({ 'error': 'Invalid refresh token' }); //forbidden

			// refresh token ws still valid
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

			const newRefreshToken = jwt.sign(
				{ username: foundUser.username },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '1d' }
			)
			
			// save the refresh token with the current user in the database
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			// create secure cookie
			res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true });

			res.json({ accessToken });
		}
	)
}

module.exports = { handleRereshToken };