const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'error': 'Missing user or password' });

	// find the user in the database
	const foundUser = usersDB.users.find(u => u.username === user);
	if (!foundUser) return res.status(401).json({ 'error': 'Invalid username or password' });

	// compare the password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (!match) return res.status(401).json({ 'error': 'Invalid username or password' });
	res.json({ 'success': `Welcome ${user}` });
}

module.exports = { handleLogin };