const db = require('../database');

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Products', (err, rows) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            resolve(rows);
        });
    });
};

const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Products WHERE Id = ?', [id], (err, row) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (!row) {
                return reject({ status: 404, msg: 'Product not found' });
            }
            resolve(row);
        });
    });
};

const createProduct = (name, price) => {
    return new Promise((resolve, reject) => {
        if (!name || !price) {
            return reject({ status: 400, msg: 'Please provide name and price' });
        }
        db.run('INSERT INTO Products (Name, Price) VALUES (?, ?)', [name, price], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            resolve({ id: this.lastID, name, price });
        });
    });
};

const updateProduct = (id, name, price) => {
    return new Promise((resolve, reject) => {
        if (!name || !price) {
            return reject({ status: 400, msg: 'Please provide name and price' });
        }
        db.run('UPDATE Products SET Name = ?, Price = ? WHERE Id = ?', [name, price, id], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (this.changes === 0) {
                return reject({ status: 404, msg: 'Product not found' });
            }
            resolve({ id, name, price });
        });
    });
};

const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM Products WHERE Id = ?', [id], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (this.changes === 0) {
                return reject({ status: 404, msg: 'Product not found' });
            }
            resolve({ msg: 'Product deleted successfully' });
        });
    });
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};