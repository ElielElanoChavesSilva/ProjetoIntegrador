const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
    const { products } = req.body;
    const userId = req.user.id;

    try {
        const result = await orderService.createOrder(userId, products);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await orderService.getOrders(userId);
        res.json(orders);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};