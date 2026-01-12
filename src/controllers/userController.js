const userService = require('../services/userService');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const result = await userService.deleteUserProfile(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};
