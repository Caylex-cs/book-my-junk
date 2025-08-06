
const assert = require('assert');
const request = require('supertest');
const app = require('../server.js');
const db = require('../database/database.js');

describe('Phase 4: Admin Functionality', () => {
    let adminToken = '';
    let normalUserToken = '';
    let bookingId = '';

    before((done) => {
        // Clear tables and create an admin user and a normal user
        db.serialize(() => {
            db.run('DELETE FROM bookings', (err) => {
                if (err) return done(err);
            });
            db.run('DELETE FROM users', (err) => {
                if (err) return done(err);
                // Create admin user
                request(app)
                    .post('/api/auth/signup')
                    .send({ username: 'adminuser', password: 'admin123' })
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        db.run('UPDATE users SET role = ? WHERE id = ?', ['admin', res.body.userId], (err) => {
                            if (err) return done(err);
                            request(app)
                                .post('/api/auth/login')
                                .send({ username: 'adminuser', password: 'admin123' })
                                .expect(200)
                                .end((err, res) => {
                                    if (err) return done(err);
                                    adminToken = res.body.token;
                                    // Create normal user and a booking
                                    request(app)
                                        .post('/api/auth/signup')
                                        .send({ username: 'normaluser', password: 'normal123' })
                                        .expect(201)
                                        .end((err, res) => {
                                            if (err) return done(err);
                                            const normalUserId = res.body.userId;
                                            request(app)
                                                .post('/api/auth/login')
                                                .send({ username: 'normaluser', password: 'normal123' })
                                                .expect(200)
                                                .end((err, res) => {
                                                    if (err) return done(err);
                                                    normalUserToken = res.body.token;
                                                    request(app)
                                                        .post('/api/bookings')
                                                        .set('x-access-token', normalUserToken)
                                                        .send({ junkType: 'Old Sofa', pickupDate: '2025-08-01', address: '100 User St' })
                                                        .expect(201)
                                                        .end((err, res) => {
                                                            if (err) return done(err);
                                                            bookingId = res.body.bookingId;
                                                            done();
                                                        });
                                                });
                                        });
                                });
                        });
                    });
            });
        });
    });

    it('should allow an admin to get all bookings', (done) => {
        request(app)
            .get('/api/admin/bookings')
            .set('x-access-token', adminToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                assert.strictEqual(res.body.length, 1);
                assert.strictEqual(res.body[0].junkType, 'Old Sofa');
                done();
            });
    });

    it('should allow an admin to update a booking status', (done) => {
        request(app)
            .put(`/api/admin/bookings/${bookingId}`)
            .set('x-access-token', adminToken)
            .send({ status: 'confirmed' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Booking status updated successfully.');
                done();
            });
    });

    it('should not allow a normal user to get all bookings', (done) => {
        request(app)
            .get('/api/admin/bookings')
            .set('x-access-token', normalUserToken)
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Require Admin Role!');
                done();
            });
    });

    it('should not allow a normal user to update a booking status', (done) => {
        request(app)
            .put(`/api/admin/bookings/${bookingId}`)
            .set('x-access-token', normalUserToken)
            .send({ status: 'completed' })
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Require Admin Role!');
                done();
            });
    });
});
