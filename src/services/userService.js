const bcrypt = require('bcryptjs');
const db = require('../database');

const getUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT Id, Name, Email FROM Users WHERE Id = ?', [userId], (err, row) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (!row) {
                return reject({ status: 404, msg: 'User not found' });
            }
            resolve(row);
        });
    });
};

const updateUserProfile = (userId, { name, email, password }) => {
    return new Promise((resolve, reject) => {
        if (!name && !email && !password) {
            return reject({ status: 400, msg: 'Please provide data to update' });
        }

        // First, get the current user data
        db.get('SELECT * FROM Users WHERE Id = ?', [userId], (err, user) => {
            if (err) { return reject({ status: 500, msg: err.message }); }
            if (!user) { return reject({ status: 404, msg: 'User not found' }); }

            const newName = name || user.Name;
            const newEmail = email || user.Email;

            if (password) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return reject({ status: 500, msg: 'Error generating salt' });
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) return reject({ status: 500, msg: 'Error hashing password' });
                        
                        db.run('UPDATE Users SET Name = ?, Email = ?, Password = ? WHERE Id = ?', [newName, newEmail, hash, userId], function(err) {
                            if (err) { return reject({ status: 500, msg: err.message }); }
                            resolve({ id: userId, name: newName, email: newEmail });
                        });
                    });
                });
            } else {
                db.run('UPDATE Users SET Name = ?, Email = ? WHERE Id = ?', [newName, newEmail, userId], function(err) {
                    if (err) { return reject({ status: 500, msg: err.message }); }
                    resolve({ id: userId, name: newName, email: newEmail });
                });
            }
        });
    });
};

const deleteUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        // Here you might want to handle cascading deletes for orders, etc.
        // For simplicity, we'll just delete the user.
        db.run('DELETE FROM Users WHERE Id = ?', [userId], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (this.changes === 0) {
                return reject({ status: 404, msg: 'User not found' });
            }
            resolve({ msg: 'User profile deleted successfully' });
        });
    });
};

const addProductToShoppingList = (userId, productId) => {
    return new Promise((resolve, reject) => {
        // First, check if the product exists
        db.get('SELECT Id FROM Products WHERE Id = ?', [productId], (err, product) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (!product) {
                return reject({ status: 404, msg: 'Product not found' });
            }

            // If product exists, add it to the shopping list
            db.run('INSERT INTO ShoppingList (UserId, ProductId) VALUES (?, ?)', [userId, productId], function (err) {
                if (err) {
                    // Check for unique constraint violation (product already in list)
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return reject({ status: 409, msg: 'Product already in shopping list' });
                    }
                    return reject({ status: 500, msg: err.message });
                }
                resolve({ msg: 'Product added to shopping list' });
            });
        });
    });
};

const getShoppingList = (userId) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT p.Id, p.Name, p.Price FROM Products p
                JOIN ShoppingList sl ON p.Id = sl.ProductId
                WHERE sl.UserId = ?`, [userId], (err, rows) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            resolve(rows);
        });
    });
};

const removeProductFromShoppingList = (userId, productId) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM ShoppingList WHERE UserId = ? AND ProductId = ?', [userId, productId], function (err) {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (this.changes === 0) {
                return reject({ status: 404, msg: 'Product not found in shopping list' });
            }
            resolve({ msg: 'Product removed from shopping list' });
        });
    });
};


module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    addProductToShoppingList,
    getShoppingList,
    removeProductFromShoppingList,
};
