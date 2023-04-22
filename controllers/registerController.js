const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'error': 'Missing user or password' });

	// check for duplicate usernames in the database
	const duplicate = usersDB.users.find(u => u.username === user);
	if (duplicate) return res.status(409).json({ 'error': 'Username already exists' });
	try {
		// hash the password
		const hashedPwd = await bcrypt.hash(pwd, 10);

		// add the new user to the database
		const newUser = { username: user, password: hashedPwd };
		usersDb.setUsers([...usersDB.users, newUser]);
		await fsPromises.writeFile(path.join(__dirname, '../model/users.json'), JSON.stringify(usersDB.users));
		console.log(usersDB.users);
		res.status(201).json({ 'success': `New user ${user} created` });

	} catch (error) {
		res.status(500).json({ 'error': error.message });
	}
}

module.exports = { handleNewUser };