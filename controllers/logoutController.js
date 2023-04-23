const User = require('../model/User');

const handleLogout = async (req, res) => {
	// on client, also delete the access token

	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(204) // no content
	const refreshToken = cookies.jwt;

	// is refresh token in the database?
	const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204); // no content
	}

	// delete refresh token from database
	foundUser.refreshToken = null;
	await foundUser.save();
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true
	res.sendStatus(204); // no content
}

module.exports = { handleLogout };