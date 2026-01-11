const db = require('../database');

exports.getAllProducts = (req, res) => {
    db.all('SELECT * FROM Products', (err, rows) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        res.json(rows);
    });
};
