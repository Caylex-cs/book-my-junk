const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database/database.js');

const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,x-access-token'
}));

app.use(express.json());

const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

const bookingRoutes = require('./routes/bookings.js');
app.use('/api/bookings', bookingRoutes);

const adminRoutes = require('./routes/admin.js');
app.use('/api/admin', adminRoutes);

const userRoutes = require('./routes/users.js');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Book My Junk API');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;