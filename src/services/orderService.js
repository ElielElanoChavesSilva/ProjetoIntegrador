const db = require('../database');

const createOrder = (userId, products) => {
    return new Promise((resolve, reject) => {
        if (!products || !Array.isArray(products) || products.length === 0) {
            return reject({ status: 400, msg: 'Please provide products to order' });
        }

        db.run('INSERT INTO Orders (UserId) VALUES (?)', [userId], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }

            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO OrderProducts (OrderId, ProductId, Quantity) VALUES (?, ?, ?)');

            products.forEach(product => {
                stmt.run(orderId, product.id, product.quantity);
            });

            stmt.finalize((err) => {
                if (err) {
                    return reject({ status: 500, msg: err.message });
                }
                resolve({ orderId });
            });
        });
    });
};

const getOrders = (userId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Orders WHERE UserId = ?', [userId], (err, orders) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }

            const promises = orders.map(order => {
                return new Promise((resolve, reject) => {
                    db.all(`
                        SELECT p.Id, p.Name, p.Price, op.Quantity
                          FROM OrderProducts op
                          JOIN Products p ON op.ProductId = p.Id
                         WHERE op.OrderId = ?
                    `, [order.Id], (err, products) => {
                        if (err) {
                            return reject(err);
                        }
                        order.products = products;
                        resolve(order);
                    });
                });
            });

            Promise.all(promises)
                .then(results => resolve(results))
                .catch(err => reject({ status: 500, msg: err.message }));
        });
    });
};

const getOrderById = (userId, orderId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Orders WHERE Id = ? AND UserId = ?', [orderId, userId], (err, order) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (!order) {
                return reject({ status: 404, msg: 'Order not found or access denied' });
            }

            db.all(`
                SELECT p.Id, p.Name, p.Price, op.Quantity
                  FROM OrderProducts op
                  JOIN Products p ON op.ProductId = p.Id
                 WHERE op.OrderId = ?
            `, [order.Id], (err, products) => {
                if (err) {
                    return reject({ status: 500, msg: err.message });
                }
                order.products = products;
                resolve(order);
            });
        });
    });
};

const updateOrder = (userId, orderId, products) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Orders WHERE Id = ? AND UserId = ?', [orderId, userId], (err, order) => {
            if (err) { return reject({ status: 500, msg: err.message }); }
            if (!order) { return reject({ status: 404, msg: 'Order not found or access denied' }); }

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM OrderProducts WHERE OrderId = ?', [orderId], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject({ status: 500, msg: 'Failed to update order products' });
                    }

                    const stmt = db.prepare('INSERT INTO OrderProducts (OrderId, ProductId, Quantity) VALUES (?, ?, ?)');
                    products.forEach(product => {
                        stmt.run(orderId, product.id, product.quantity);
                    });

                    stmt.finalize((err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject({ status: 500, msg: 'Failed to finalize order update' });
                        }
                        db.run('COMMIT');
                        resolve({ orderId, products });
                    });
                });
            });
        });
    });
};

const deleteOrder = (userId, orderId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Orders WHERE Id = ? AND UserId = ?', [orderId, userId], (err, order) => {
            if (err) { return reject({ status: 500, msg: err.message }); }
            if (!order) { return reject({ status: 404, msg: 'Order not found or access denied' }); }

            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM OrderProducts WHERE OrderId = ?', [orderId], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject({ status: 500, msg: 'Failed to delete order products' });
                    }
                    db.run('DELETE FROM Orders WHERE Id = ?', [orderId], (err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject({ status: 500, msg: 'Failed to delete order' });
                        }
                        db.run('COMMIT');
                        resolve({ msg: 'Order deleted successfully' });
                    });
                });
            });
        });
    });
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};