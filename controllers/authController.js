const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
	const cookies = req.cookies
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'error': 'Missing user or password' });

	// find the user in the database
	const foundUser = await User.findOne({ username: user }).exec();
	if (!foundUser) return res.status(401).json({ 'error': 'Invalid username or password' });

	// compare the password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (!match) return res.status(401).json({ 'error': 'Invalid username or password' });

	const roles = Object.values(foundUser.roles)
	// create a jwt tokens
	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: roles
			}
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '600s' }
	)
	const newRefreshToken = jwt.sign(
		{ username: foundUser.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	)

	let newRefreshTokenArray = !cookies?.jwt
		? foundUser.refreshToken
		: foundUser.refreshToken.filter(token => token !== cookies.jwt);

	if (cookies?.jwt) {
		const refreshToken = cookies.jwt;
		const foundToken = await User.findOne({ refreshToken }).exec();

		if (!foundToken) {
			console.log("attempted refresh token reuse at login");
			// clear out all previouse refresh tokens
			newRefreshTokenArray = [];
		}
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	}

	// save the refresh token with the current user in the database
	foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
	await foundUser.save();

	// create secure cookie
	res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true });
	res.json({ accessToken });
}

module.exports = { handleLogin };