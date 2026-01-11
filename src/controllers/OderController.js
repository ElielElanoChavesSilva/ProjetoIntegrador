const db = require('../database');

exports.createOrder = (req, res) => {
    const { products } = req.body;
    const userId = req.user.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ msg: 'Please provide products to order' });
    }

    db.run('INSERT INTO Orders (UserId) VALUES (?)', [userId], function (err) {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        const orderId = this.lastID;
        const stmt = db.prepare('INSERT INTO OrderProducts (OrderId, ProductId, Quantity) VALUES (?, ?, ?)');

        products.forEach(product => {
            stmt.run(orderId, product.id, product.quantity);
        });

        stmt.finalize((err) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            res.status(201).json({ orderId });
        });
    });
};

exports.getOrders = (req, res) => {
    const userId = req.user.id;

    db.all('SELECT * FROM Orders WHERE UserId = ?', [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
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
                        reject(err);
                    }
                    order.products = products;
                    resolve(order);
                });
            });
        });

        Promise.all(promises)
            .then(results => res.json(results))
            .catch(err => res.status(500).json({ msg: err.message }));
    });
};
