const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
	if (!employees) return res.status(204).json({ 'error': 'No employees found' });
	res.json(employees);
}

const createNewEmployee = async (req, res) => {
	if (!req?.body?.firstname || !req?.body?.lastname) {
		return res.status(400).json({ 'message': 'First and last names are required.' });
	}
	try {
		const result = await Employee.create({
			firstName: req.body.firstname,
			lastName: req.body.lastname
		});
		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ 'error': 'An error occurred while creating the employee.' });
	}
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
		return res.status(400).json({ "error": "ID param is required" });
	}

	const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ "error": `No employee matches ID` });
    }
    if (req.body?.firstname) employee.firstName = req.body.firstname;
    if (req.body?.lastname) employee.lastName = req.body.lastname;
    
	const result = await employee.save();

    res.json(result);
}

const deleteEmployee = async (req, res) => {
	if (!req?.body?.id) {
		return res.status(400).json({ "error": "ID param is required" });
	}
    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "error": `No employee matches ID` });
    }
    
	const result = await employee.deleteOne({ _id: req.body.id });
	res.json(result);
}

const getEmployee = async (req, res) => {
	if (!req?.params?.id) return res.status(400).json({ "error": "ID param is required" });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "error": `No employee matches ID` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}