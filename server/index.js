const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./temple_seva.db', (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database: temple_seva.db');
    }
});

app.get('/api/test-db', (req, res) => {
    db.get('SELECT 1 AS test', (err, row) => {
        if (err) {
            console.error('Test DB error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, row });
    });
});

app.post('/api/register', (req, res) => {
    const { username, password, email, created_at } = req.body;
    console.log('Register request:', { username, email, created_at });
    if (!username || !password || !email || !created_at) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    db.get('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) {
            console.error('Register check error:', err);
            return res.status(500).json({ error: 'Failed to register', details: err.message });
        }
        if (row) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        db.run(
            'INSERT INTO Users (username, password, email, created_at) VALUES (?, ?, ?, ?)',
            [username, password, email, created_at],
            function (err) {
                if (err) {
                    console.error('Register insert error:', err);
                    return res.status(500).json({ error: 'Failed to register', details: err.message });
                }
                console.log('User inserted:', this.lastID);
                res.status(201).json({ user_id: this.lastID });
            }
        );
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login request:', { username });
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Login query error:', err);
            return res.status(500).json({ error: 'Failed to login', details: err.message });
        }
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (password !== user.password) {
            console.log('Password mismatch:', { input: password, stored: user.password });
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ user: { user_id: user.user_id, username: user.username, email: user.email, created_at: user.created_at } });
    });
});

app.get('/api/temples', (req, res) => {
    db.all('SELECT * FROM Temples', (err, temples) => {
        if (err) {
            console.error('Temples query error:', err);
            return res.status(500).json({ error: 'Failed to fetch temples', details: err.message });
        }
        res.json(temples);
    });
});

app.get('/api/sevas', (req, res) => {
    db.all('SELECT * FROM Sevas', (err, sevas) => {
        if (err) {
            console.error('Sevas query error:', err);
            return res.status(500).json({ error: 'Failed to fetch sevas', details: err.message });
        }
        res.json(sevas);
    });
});

app.get('/api/profiles/:user_id', (req, res) => {
    db.all('SELECT * FROM User_Profiles WHERE user_id = ?', [req.params.user_id], (err, profiles) => {
        if (err) {
            console.error('Profiles query error:', err);
            return res.status(500).json({ error: 'Failed to fetch profiles', details: err.message });
        }
        res.json(profiles);
    });
});

app.post('/api/profiles', (req, res) => {
    const { user_id, full_name, rashi, nakshatra, is_user } = req.body;
    console.log('Profile request:', { user_id, full_name });
    if (!user_id || !full_name) {
        return res.status(400).json({ error: 'User ID and full name are required' });
    }
    db.run(
        'INSERT INTO User_Profiles (user_id, full_name, rashi, nakshatra, is_user) VALUES (?, ?, ?, ?, ?)',
        [user_id, full_name, rashi, nakshatra, is_user],
        function (err) {
            if (err) {
                console.error('Profile insert error:', err);
                return res.status(500).json({ error: 'Failed to add profile', details: err.message });
            }
            res.json({ profile_id: this.lastID, user_id, full_name, rashi, nakshatra, is_user });
        }
    );
});

app.get('/api/orders/:user_id', (req, res) => {
    db.all('SELECT * FROM Orders WHERE user_id = ?', [req.params.user_id], (err, orders) => {
        if (err) {
            console.error('Orders query error:', err);
            return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
        }
        res.json(orders);
    });
});

app.post('/api/orders', (req, res) => {
    const { user_id, profile_id, seva_id, order_date, status } = req.body;
    console.log('Order request:', { user_id, profile_id, seva_id });
    if (!user_id || !profile_id || !seva_id) {
        return res.status(400).json({ error: 'User ID, profile ID, and seva ID are required' });
    }
    db.run(
        'INSERT INTO Orders (user_id, profile_id, seva_id, order_date, status) VALUES (?, ?, ?, ?, ?)',
        [user_id, profile_id, seva_id, order_date, status],
        function (err) {
            if (err) {
                console.error('Order insert error:', err);
                return res.status(500).json({ error: 'Failed to place order', details: err.message });
            }
            res.json({ order_id: this.lastID, user_id, profile_id, seva_id, order_date, status });
        }
    );
});

app.post('/api/shipping', (req, res) => {
    const { address, orderShipping } = req.body;
    console.log('Shipping request:', { address, orderShipping });
    if (!address.user_id || !address.address_line1 || !address.city || !address.state || !address.country || !address.postal_code) {
        return res.status(400).json({ error: 'All address fields are required' });
    }
    db.run(
        'INSERT INTO Shipping_Addresses (user_id, address_line1, address_line2, city, state, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [address.user_id, address.address_line1, address.address_line2, address.city, address.state, address.country, address.postal_code],
        function (err) {
            if (err) {
                console.error('Shipping address insert error:', err);
                return res.status(500).json({ error: 'Failed to save shipping address', details: err.message });
            }
            const address_id = this.lastID;
            db.get('SELECT order_id FROM Orders ORDER BY order_id DESC LIMIT 1', (err, row) => {
                if (err) {
                    console.error('Order query error:', err);
                    return res.status(500).json({ error: 'Failed to save shipping address', details: err.message });
                }
                const order_id = row.order_id;
                db.run(
                    'INSERT INTO Order_Shipping (order_id, address_id, shipping_date, tracking_number) VALUES (?, ?, ?, ?)',
                    [order_id, address_id, null, null],
                    function (err) {
                        if (err) {
                            console.error('Order shipping insert error:', err);
                            return res.status(500).json({ error: 'Failed to save shipping address', details: err.message });
                        }
                        res.json({ success: true });
                    }
                );
            });
        }
    );
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});