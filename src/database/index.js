const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados para evitar erros de diretório
const dbPath = path.resolve(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

db.serialize(() => {
    // 1. Tabela de Usuários
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL UNIQUE,
        Password TEXT NOT NULL
    )`);

    // 2. Tabela da Lista de Compras (Nova Estrutura para o Android)
    db.run(`CREATE TABLE IF NOT EXISTS ShoppingList (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nome TEXT NOT NULL,
        Categoria TEXT,
        Grupo TEXT,
        Quantidade INTEGER DEFAULT 1,
        Marcado INTEGER DEFAULT 0, -- 0 = false, 1 = true
        DataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        UserId INTEGER,
        FOREIGN KEY (UserId) REFERENCES Users (Id)
    )`);

    // 3. Populando dados iniciais de teste se a tabela estiver vazia
    db.get("SELECT COUNT(*) as count FROM ShoppingList", (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("Tabela vazia. Populando dados iniciais de teste...");
            
            const initialItems = [
                { nome: 'Banana', categoria: 'Frutas & Legumes', grupo: 'Mercado', quantidade: 5, userId: 1 },
                { nome: 'Detergente', categoria: 'Limpeza', grupo: 'Mercado', quantidade: 2, userId: 1 },
                { nome: 'Pão Francês', categoria: 'Padaria', grupo: 'Mercado', quantidade: 10, userId: 1 }
            ];

            const stmt = db.prepare(`INSERT INTO ShoppingList (Nome, Categoria, Grupo, Quantidade, UserId) VALUES (?, ?, ?, ?, ?)`);
            initialItems.forEach(item => {
                stmt.run(item.nome, item.categoria, item.grupo, item.quantidade, item.userId);
            });
            stmt.finalize();
            console.log("Dados de teste inseridos com sucesso!");
        }
    });
});

module.exports = db;