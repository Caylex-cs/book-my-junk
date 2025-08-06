
const assert = require('assert');
const request = require('supertest');
const app = require('../server.js');
const db = require('../database/database.js');

describe('Phase 3: Booking Management (User Role)', () => {
    let userToken = '';
    let userId = '';
    let bookingId = '';

    before((done) => {
        // Clear tables and create a test user for authentication
        db.serialize(() => {
            db.run('DELETE FROM bookings', (err) => {
                if (err) return done(err);
            });
            db.run('DELETE FROM users', (err) => {
                if (err) return done(err);
                request(app)
                    .post('/api/auth/signup')
                    .send({ username: 'bookinguser', password: 'password123' })
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        userId = res.body.userId;
                        request(app)
                            .post('/api/auth/login')
                            .send({ username: 'bookinguser', password: 'password123' })
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err);
                                userToken = res.body.token;
                                done();
                            });
                    });
            });
        });
    });

    it('should allow a logged-in user to create a booking', (done) => {
        request(app)
            .post('/api/bookings')
            .set('x-access-token', userToken)
            .send({ junkType: 'Furniture', pickupDate: '2025-07-10', address: '123 Main St' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Booking created successfully');
                assert.ok(res.body.bookingId);
                bookingId = res.body.bookingId;
                done();
            });
    });

    it('should allow a logged-in user to get their bookings', (done) => {
        request(app)
            .get('/api/bookings')
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.ok(Array.isArray(res.body));
                assert.strictEqual(res.body.length, 1);
                assert.strictEqual(res.body[0].junkType, 'Furniture');
                done();
            });
    });

    it('should allow a logged-in user to update their booking', (done) => {
        request(app)
            .put(`/api/bookings/${bookingId}`)
            .set('x-access-token', userToken)
            .send({ junkType: 'Appliances', pickupDate: '2025-07-15', address: '456 Oak Ave', status: 'pending' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Booking updated successfully.');
                done();
            });
    });

    it('should allow a logged-in user to delete their booking', (done) => {
        request(app)
            .delete(`/api/bookings/${bookingId}`)
            .set('x-access-token', userToken)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.strictEqual(res.body.message, 'Booking deleted successfully.');
                done();
            });
    });

    it('should not allow a user to update a booking they do not own', (done) => {
        // Create another user and try to update the first user's booking
        let otherUserToken = '';
        request(app)
            .post('/api/auth/signup')
            .send({ username: 'otheruser', password: 'password123' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                request(app)
                    .post('/api/auth/login')
                    .send({ username: 'otheruser', password: 'password123' })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        otherUserToken = res.body.token;
                        request(app)
                            .put(`/api/bookings/${bookingId}`)
                            .set('x-access-token', otherUserToken)
                            .send({ junkType: 'Electronics', pickupDate: '2025-07-20', address: '789 Pine Rd', status: 'pending' })
                            .expect(404) // Expect 404 because the booking won't be found for this user
                            .end((err, res) => {
                                if (err) return done(err);
                                assert.strictEqual(res.body.message, 'Booking not found or not authorized to update.');
                                done();
                            });
                    });
            });
    });
});
