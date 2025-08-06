
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

const signup = (req, res) => {
    const { username, password } = req.body;
    User.createUser(username, password, 'customer', (err, user) => {
        if (err) {
            console.error(err); // Log the full error object
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ message: 'Username already exists.' });
            }
            return res.status(500).json({ message: 'Error creating user', error: err });
        }
        process.nextTick(() => {
            res.status(201).json({ message: 'User created successfully', userId: user.id });
        });
    });
};

const adminLogin = (req, res) => {
    const { username, password } = req.body;
    User.findUserByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Authentication failed. Not an admin.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({ auth: true, token: token });
    });
};

const customerLogin = (req, res) => {
    const { username, password } = req.body;
    User.findUserByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (user.role !== 'customer') {
            return res.status(403).json({ message: 'Authentication failed. Not a customer.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({ auth: true, token: token });
    });
};

module.exports = {
    signup,
    adminLogin,
    customerLogin
};
