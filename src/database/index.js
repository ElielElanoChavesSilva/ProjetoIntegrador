const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Products (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Price REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Orders (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS OrderProducts (
        OrderId INTEGER,
        ProductId INTEGER,
        Quantity INTEGER,
        FOREIGN KEY (OrderId) REFERENCES orders (Id),
        FOREIGN KEY (ProductId) REFERENCES products (Id)
    )`);

    const products = [
        { name: 'Refrigerante', price: 0.5 },
        { name: 'Banana', price: 0.3 },
        { name: 'Leite', price: 1.5 },
        { name: 'Café', price: 2.0 },
    ];

    products.forEach(product => {
        db.run(`INSERT INTO Products (name, price) VALUES (?, ?)`, [product.name, product.price]);
    });
});

module.exports = db;
