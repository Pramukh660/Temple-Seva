const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./temple_seva.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database: temple_seva.db');
});

db.serialize(() => {
    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Error creating Users table:', err);
    });

    // Create User_Profiles table
    db.run(`
        CREATE TABLE IF NOT EXISTS User_Profiles (
            profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            full_name TEXT NOT NULL,
            rashi TEXT,
            nakshatra TEXT,
            is_user BOOLEAN NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        )
    `, (err) => {
        if (err) console.error('Error creating User_Profiles table:', err);
    });

    // Create Temples table
    db.run(`
        CREATE TABLE IF NOT EXISTS Temples (
            temple_id INTEGER PRIMARY KEY AUTOINCREMENT,
            temple_name TEXT NOT NULL,
            location TEXT NOT NULL,
            specialties TEXT
        )
    `, (err) => {
        if (err) console.error('Error creating Temples table:', err);
    });

    // Create Sevas table
    db.run(`
        CREATE TABLE IF NOT EXISTS Sevas (
            seva_id INTEGER PRIMARY KEY AUTOINCREMENT,
            temple_id INTEGER NOT NULL,
            seva_name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            FOREIGN KEY (temple_id) REFERENCES Temples(temple_id)
        )
    `, (err) => {
        if (err) console.error('Error creating Sevas table:', err);
    });

    // Create Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS Orders (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            profile_id INTEGER NOT NULL,
            seva_id INTEGER NOT NULL,
            order_date TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (profile_id) REFERENCES User_Profiles(profile_id),
            FOREIGN KEY (seva_id) REFERENCES Sevas(seva_id)
        )
    `, (err) => {
        if (err) console.error('Error creating Orders table:', err);
    });

    // Create Shipping_Addresses table
    db.run(`
        CREATE TABLE IF NOT EXISTS Shipping_Addresses (
            address_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            address_line1 TEXT NOT NULL,
            address_line2 TEXT,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            country TEXT NOT NULL,
            postal_code TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id)
        )
    `, (err) => {
        if (err) console.error('Error creating Shipping_Addresses table:', err);
    });

    // Create Order_Shipping table
    db.run(`
        CREATE TABLE IF NOT EXISTS Order_Shipping (
            order_shipping_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            address_id INTEGER NOT NULL,
            shipping_date TEXT,
            tracking_number TEXT,
            FOREIGN KEY (order_id) REFERENCES Orders(order_id),
            FOREIGN KEY (address_id) REFERENCES Shipping_Addresses(address_id)
        )
    `, (err) => {
        if (err) console.error('Error creating Order_Shipping table:', err);
    });

    // Insert initial temple and seva data
    db.run(`
        INSERT OR IGNORE INTO Temples (temple_name, location, specialties)
        VALUES
            ('Sri Venkateswara Temple', 'Tirupati, Andhra Pradesh', 'Famous for Lord Venkateswara'),
            ('Meenakshi Temple', 'Madurai, Tamil Nadu', 'Dedicated to Goddess Meenakshi')
    `, (err) => {
        if (err) console.error('Error inserting Temples:', err);
    });

    db.run(`
        INSERT OR IGNORE INTO Sevas (temple_id, seva_name, description, price)
        VALUES
            (1, 'Suprabhatam', 'Morning prayer', 200.00),
            (1, 'Archana', 'Special pooja', 100.00),
            (2, 'Abhishekam', 'Ritual bathing', 150.00)
    `, (err) => {
        if (err) console.error('Error inserting Sevas:', err);
    });

    // Insert test user
    db.run(`
        INSERT OR IGNORE INTO Users (username, password, email, created_at)
        VALUES ('testuser', 'password123', 'test@example.com', '2025-08-03 17:48:00')
    `, (err) => {
        if (err) console.error('Error inserting test user:', err);
        else console.log('Test user inserted: testuser');
    });
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database initialization complete');
    }
});