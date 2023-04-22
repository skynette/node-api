const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'error': 'Missing user or password' });

	// find the user in the database
	const foundUser = usersDB.users.find(u => u.username === user);
	if (!foundUser) return res.status(401).json({ 'error': 'Invalid username or password' });

	// compare the password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (!match) return res.status(401).json({ 'error': 'Invalid username or password' });

	// create a jwt tokens
	const accessToken = jwt.sign(
		{ username: foundUser.username },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '30s' }
	)
	const refreshToken = jwt.sign(
		{ username: foundUser.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	)
	// save the refresh token with the current user in the database
	const otherUsers = usersDB.users.filter(u => u.username !== foundUser.username);
	const currentUser = { ...foundUser, refreshToken };
	usersDB.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(path.join(__dirname, '../model/users.json'), JSON.stringify(usersDB.users));
	
	res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 *60 * 1000 });
	res.json({ accessToken});
}

module.exports = { handleLogin };