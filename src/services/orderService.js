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
                    `, [order.id], (err, products) => {
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

module.exports = {
    createOrder,
    getOrders,
};
