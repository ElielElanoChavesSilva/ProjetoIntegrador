const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    db.get('SELECT * FROM Users WHERE Email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        if (row) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                db.run('INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)', [name, email, hash], function (err) {
                    if (err) {
                        return res.status(500).json({ msg: err.message });
                    }
                    res.status(201).json({ id: this.lastID, name, email });
                });
            });
        });
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            jwt.sign(
                { id: user.id },
                'your_jwt_secret',
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                }
            );
        });
    });
};
