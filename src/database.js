const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Usuários
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL
    )`);

    // Lista de Compras (CORRIGIDO: A DataCriacao voltou!)
    db.run(`CREATE TABLE IF NOT EXISTS ShoppingList (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        Categoria TEXT,
        Grupo TEXT,
        Quantidade INTEGER DEFAULT 1,
        Marcado INTEGER DEFAULT 0,
        DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);

    // HIERARQUIA DINÂMICA
    db.run(`CREATE TABLE IF NOT EXISTS UserGroups (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS UserCategories (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        GrupoNome TEXT NOT NULL, 
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS UserProducts (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        CategoriaNome TEXT NOT NULL,
        GrupoNome TEXT NOT NULL,
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);
});

module.exports = db;