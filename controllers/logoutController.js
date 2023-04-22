const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');


const handleLogout = (req, res) => {
	// on client, also delete the access token

	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(204) // no content
	const refreshToken = cookies.jwt;

	// is refresh token in the database?
	const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken);
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true });
		return res.sendStatus(204); // no content
	}

	// delete refresh token from database
	const otherUsers = usersDB.users.filter(u => u.refreshToken !== refreshToken);
	const currentUser = { ...foundUser, refreshToken: '' };
	usersDB.setUsers([...otherUsers, currentUser]);
	fsPromises.writeFile(
		path.join(__dirname, '../model/users.json'),
		JSON.stringify(usersDB.users)
	)

	res.clearCookie('jwt', { httpOnly: true }); // secure: true
	res.sendStatus(204); // no content
}

module.exports = { handleLogout };