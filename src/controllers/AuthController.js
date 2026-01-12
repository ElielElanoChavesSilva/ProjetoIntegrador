const authService = require('../services/authService');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await authService.signup(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.signin(email, password);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};