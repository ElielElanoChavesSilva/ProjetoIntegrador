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

exports.getShoppingList = async (req, res) => {
    try {
        const shoppingList = await userService.getShoppingList(req.user.id);
        res.json(shoppingList);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.addProductToShoppingList = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ msg: 'ProductId is required' });
        }
        const result = await userService.addProductToShoppingList(req.user.id, productId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.removeProductFromShoppingList = async (req, res) => {
    try {
        const { productId } = req.params;
        const result = await userService.removeProductFromShoppingList(req.user.id, productId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

