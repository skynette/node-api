const User = require('../model/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};



exports.updateUser = async (req, res) => {
	const { id } = req.params;
	const { username, roles, password } = req.body;

	try {
		const user = await User.findById(id);
		if (!user) throw new Error('User not found');

		user.username = username || user.username;
		user.roles = roles || user.roles;

		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			user.password = hashedPassword;
		}

		const updatedUser = await user.save();
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) throw new Error('User not found');

		res.status(200).json(deletedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getUser = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);
		if (!user) throw new Error('User not found');

		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};
