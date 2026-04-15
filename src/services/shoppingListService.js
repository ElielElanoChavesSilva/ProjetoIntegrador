const db = require('../database');

class ShoppingListService {
    listByUser(userId) {
        return new Promise((resolve, reject) => {
            db.all("SELECT Id as id, Nome as nome, Categoria as categoria, Grupo as grupo, Quantidade as quantidade, Marcado as marcado, DataCriacao as dataCriacao FROM ShoppingList WHERE UserId = ?", [userId], (err, rows) => {
                if (err) {
                    console.error("[ERRO SQL] Falha ao listar itens:", err.message);
                    return reject(err);
                }
                const formattedRows = rows.map(row => ({
                    ...row,
                    marcado: row.marcado === 1
                }));
                resolve(formattedRows);
            });
        });
    }

    add(userId, item) {
        return new Promise((resolve, reject) => {
            const { nome, categoria, grupo, quantidade } = item;
            db.run(
                `INSERT INTO ShoppingList (Nome, Categoria, Grupo, Quantidade, UserId) VALUES (?, ?, ?, ?, ?)`,
                [nome, categoria, grupo, quantidade, userId],
                function(err) {
                    if (err) {
                        console.error("[ERRO SQL] Falha ao adicionar item:", err.message);
                        return reject(err);
                    }
                    resolve({ id: this.lastID, ...item, marcado: false });
                }
            );
        });
    }

    update(id, userId, data) {
        return new Promise((resolve, reject) => {
            const { nome, quantidade, marcado } = data;
            const marcadoInt = marcado ? 1 : 0;
            db.run(
                `UPDATE ShoppingList SET Nome = ?, Quantidade = ?, Marcado = ? WHERE Id = ? AND UserId = ?`,
                [nome, quantidade, marcadoInt, id, userId],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }

    // NOVA FUNÇÃO: Alternar (Toggle) com segurança
    toggle(id, userId) {
        return new Promise((resolve, reject) => {
            // 1. Inverte o valor (1 vira 0, 0 vira 1) SOMENTE se pertencer ao usuário
            db.run(
                `UPDATE ShoppingList SET Marcado = 1 - Marcado WHERE Id = ? AND UserId = ?`,
                [id, userId],
                function(err) {
                    if (err) return reject(err);
                    
                    // Se changes for 0, o item não existe ou pertence a outro usuário (Tentativa de invasão evitada!)
                    if (this.changes === 0) {
                        return reject(new Error("Acesso Negado ou Item Inexistente."));
                    }

                    // 2. Busca o item atualizado para devolver ao Android
                    db.get(
                        `SELECT Id as id, Nome as nome, Categoria as categoria, Grupo as grupo, Quantidade as quantidade, Marcado as marcado FROM ShoppingList WHERE Id = ?`,
                        [id],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve({
                                ...row,
                                marcado: row.marcado === 1
                            });
                        }
                    );
                }
            );
        });
    }

    delete(id, userId) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ShoppingList WHERE Id = ? AND UserId = ?`, [id, userId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new ShoppingListService();