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


module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
