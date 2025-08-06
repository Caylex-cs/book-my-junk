
const db = require('../database/database.js');
const bcrypt = require('bcryptjs');

const createUser = (username, password, role = 'customer', callback) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.run(sql, [username, hashedPassword, role], function(err) {
        callback(err, { id: this.lastID });
    });
};

const findUserByUsername = (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
        callback(err, row);
    });
};

const getUserById = (id, callback) => {
    const sql = 'SELECT id, username, password, role FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        callback(err, row);
    });
};

const updateUser = (id, username, callback) => {
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    db.run(sql, [username, id], function(err) {
        callback(err, { changes: this.changes });
    });
};

const updatePassword = (id, newPassword, callback) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    db.run(sql, [hashedPassword, id], function(err) {
        callback(err, { changes: this.changes });
    });
};

const deleteUser = (id, callback) => {
    db.serialize(() => {
        db.run('DELETE FROM bookings WHERE userId = ?', [id], (err) => {
            if (err) return callback(err);
            db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
                callback(err, { changes: this.changes });
            });
        });
    });
};

module.exports = {
    createUser,
    findUserByUsername,
    getUserById,
    updateUser,
    updatePassword,
    deleteUser
};
