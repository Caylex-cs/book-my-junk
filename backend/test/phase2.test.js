
const assert = require('assert');
const request = require('supertest');
const app = require('../server.js');
const db = require('../database/database.js');

describe('Phase 2: User Authentication', () => {
    before((done) => {
        // Clear the users table before running tests
        db.run('DELETE FROM users', (err) => {
            if (err) return done(err);
            done();
        });
    });

    it('should allow a new user to sign up', (done) => {
        request(app)
            .post('/api/auth/signup')
            .send({ username: 'testuser', password: 'password123' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'User created successfully');
                done();
            });
    });

    it('should allow an existing user to log in and receive a token', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(res.body.auth);
                assert.ok(res.body.token);
                done();
            });
    });

    it('should not allow login with incorrect password', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'wrongpassword' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Authentication failed. Wrong password.');
                done();
            });
    });

    it('should not allow login for non-existent user', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({ username: 'nonexistent', password: 'password123' })
            .expect(401)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Authentication failed. User not found.');
                done();
            });
    });
});
