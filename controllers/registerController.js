const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'error': 'Missing user or password' });

	// check for duplicate usernames in the database
	const duplicate = await User.findOne({ username: user }).exec();
	if (duplicate) return res.status(409).json({ 'error': 'Username already exists' });
	try {
		// hash the password
		const hashedPwd = await bcrypt.hash(pwd, 10);

		// create and add the new user to the database
		const result = await User.create({
			username: user,
			password: hashedPwd
		});
		console.log(result);
		res.status(201).json({ 'success': `New user ${user} created` });

	} catch (error) {
		res.status(500).json({ 'error': error.message });
	}
}

module.exports = { handleNewUser };