
const assert = require('assert');
const fs = require('fs');
const db = require('../database/database.js');

describe('Phase 1 Setup', () => {
    it('should create the database file', () => {
        assert.ok(fs.existsSync('/Users/kanaktilotia/Downloads/book-my-junk-main/backend/database/main.db'));
    });

    it('should create the users table', (done) => {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
            if (err) {
                done(err);
            }
            assert.strictEqual(row.name, 'users');
            done();
        });
    });

    it('should create the bookings table', (done) => {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings'", (err, row) => {
            if (err) {
                done(err);
            }
            assert.strictEqual(row.name, 'bookings');
            done();
        });
    });
});
