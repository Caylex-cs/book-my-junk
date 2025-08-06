const db = require('./database/database.js');
const bcrypt = require('bcryptjs');

db.serialize(() => {
    // 1. Delete all existing bookings
    db.run('DELETE FROM bookings', (err) => {
        if (err) {
            console.error('Error deleting bookings:', err.message);
        } else {
            console.log('All existing bookings deleted.');
        }
    });

    // 2. Delete all existing users
    db.run('DELETE FROM users', (err) => {
        if (err) {
            console.error('Error deleting users:', err.message);
        } else {
            console.log('All existing users deleted.');
        }
    });

    // 3. Create Admin User
    const adminUsername = 'admin@bookmyjunk.com';
    const adminPassword = 'adminpass';
    const adminHashedPassword = bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10));
    let adminUserId;
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [adminUsername, adminHashedPassword, 'admin'], function(err) {
        if (err) {
            console.error('Error creating admin user:', err.message);
        } else {
            adminUserId = this.lastID;
            console.log(`Admin user '${adminUsername}' created with ID: ${adminUserId}`);
        }
    });

    // 4. Create Consumer User 1
    const consumer1Username = 'john.doe@example.com';
    const consumer1Password = 'johnpass';
    const consumer1HashedPassword = bcrypt.hashSync(consumer1Password, bcrypt.genSaltSync(10));
    let consumer1UserId;
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [consumer1Username, consumer1HashedPassword, 'customer'], function(err) {
        if (err) {
            console.error('Error creating consumer user 1:', err.message);
        } else {
            consumer1UserId = this.lastID;
            console.log(`Consumer user '${consumer1Username}' created with ID: ${consumer1UserId}`);

            // Add dummy bookings for Consumer 1
            db.run('INSERT INTO bookings (userId, junkType, pickupDate, address, status, price) VALUES (?, ?, ?, ?, ?, ?)', [consumer1UserId, 'Old Furniture', '2025-07-10T10:00:00', '123 Main St, Anytown', 'pending', 80]);
            db.run('INSERT INTO bookings (userId, junkType, pickupDate, address, status, price) VALUES (?, ?, ?, ?, ?, ?)', [consumer1UserId, 'Electronics Waste', '2025-07-04T14:30:00', '123 Main St, Anytown', 'completed', 60]); // Completed today
        }
    });

    // 5. Create Consumer User 2
    const consumer2Username = 'jane.smith@example.com';
    const consumer2Password = 'janepass';
    const consumer2HashedPassword = bcrypt.hashSync(consumer2Password, bcrypt.genSaltSync(10));
    let consumer2UserId;
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [consumer2Username, consumer2HashedPassword, 'customer'], function(err) {
        if (err) {
            console.error('Error creating consumer user 2:', err.message);
        } else {
            consumer2UserId = this.lastID;
            console.log(`Consumer user '${consumer2Username}' created with ID: ${consumer2UserId}`);

            // Add dummy bookings for Consumer 2
            db.run('INSERT INTO bookings (userId, junkType, pickupDate, address, status, price) VALUES (?, ?, ?, ?, ?, ?)', [consumer2UserId, 'Plastic Bottles', '2025-07-12T09:00:00', '456 Oak Ave, Otherville', 'confirmed', 40]);
            db.run('INSERT INTO bookings (userId, junkType, pickupDate, address, status, price) VALUES (?, ?, ?, ?, ?, ?)', [consumer2UserId, 'Garden Waste', '2025-07-01T11:00:00', '456 Oak Ave, Otherville', 'cancelled', 20], function(err) {
                if (err) {
                    console.error('Error inserting consumer 2 booking:', err.message);
                }
                // Close DB here after the very last operation
                db.close((err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Database connection closed.');
                });
            });
        }
    });
});