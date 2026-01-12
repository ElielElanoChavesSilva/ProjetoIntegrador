const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        const product = await productService.createProduct(name, price);
        res.status(201).json(product);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        const product = await productService.updateProduct(req.params.id, name, price);
        res.json(product);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.msg || 'Server error' });
    }
};
