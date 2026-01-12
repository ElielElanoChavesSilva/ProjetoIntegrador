const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
        if (!name || !email || !password) {
            return reject({ status: 400, msg: 'Please enter all fields' });
        }

        db.get('SELECT * FROM Users WHERE Email = ?', [email], (err, row) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (row) {
                return reject({ status: 400, msg: 'User already exists' });
            }

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject({ status: 500, msg: 'Error generating salt' });
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return reject({ status: 500, msg: 'Error hashing password' });

                    db.run('INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)', [name, email, hash], function (err) {
                        if (err) {
                            return reject({ status: 500, msg: err.message });
                        }
                        resolve({ id: this.lastID, name, email });
                    });
                });
            });
        });
    });
};

const signin = (email, password) => {
    return new Promise((resolve, reject) => {
        if (!email || !password) {
            return reject({ status: 400, msg: 'Please enter all fields' });
        }

        db.get('SELECT * FROM Users WHERE Email = ?', [email], (err, user) => {
            if (err) {
                return reject({ status: 500, msg: err.message });
            }
            if (!user) {
                return reject({ status: 400, msg: 'User does not exist' });
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return reject({ status: 400, msg: 'Invalid credentials' });
                }

                jwt.sign(
                    { id: user.id, name: user.name, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) return reject({ status: 500, msg: 'Error signing token' });
                        resolve({
                            token,
                            user: { id: user.id, name: user.name, email: user.email }
                        });
                    }
                );
            });
        });
    });
};


module.exports = {
    signup,
    signin,
};
