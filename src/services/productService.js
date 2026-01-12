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

module.exports = {
    getAllProducts,
};
