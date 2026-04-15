const db = require('../database');
const bcrypt = require('bcryptjs');
const starterPack = require('../config/starterPack');

class UserService {
    async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM Users WHERE Email = ?", [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    async create(userData) {
        const { nome, email, senha } = userData;
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)",
                [nome, email, senhaHash],
                async function(err) {
                    if (err) return reject(err);
                    
                    const newUserId = this.lastID;
                    
                    // Dispara a semente de dados iniciais
                    try {
                        await seedUserData(newUserId);
                        resolve({ id: newUserId });
                    } catch (seedErr) {
                        reject(seedErr);
                    }
                }
            );
        });
    }
}

// Função auxiliar para popular o "Mundo Inicial" do usuário
async function seedUserData(userId) {
    console.log(`[SEED-LOG] 🌱 Gerando mundo inicial para Usuário ID: ${userId}`);

    // 1. Inserir Grupos
    for (const g of starterPack.groups) {
        db.run("INSERT INTO UserGroups (Nome, UserId) VALUES (?, ?)", [g.nome, userId]);
    }

    // 2. Inserir Categorias
    for (const c of starterPack.categories) {
        db.run("INSERT INTO UserCategories (Nome, GrupoNome, UserId) VALUES (?, ?, ?)", [c.nome, c.group, userId]);
    }

    // 3. Inserir Sugestões de Produtos
    for (const p of starterPack.products) {
        db.run("INSERT INTO UserProducts (Nome, CategoriaNome, GrupoNome, UserId) VALUES (?, ?, ?, ?)", [p.nome, p.categoria, p.group, userId]);
    }

    // 4. Inserir Itens Iniciais na Lista de Compras
    for (const i of starterPack.initialShoppingList) {
        db.run("INSERT INTO ShoppingList (Nome, Categoria, Grupo, Quantidade, UserId) VALUES (?, ?, ?, ?, ?)", 
        [i.nome, i.categoria, i.grupo, i.quantidade, userId]);
    }
    
    console.log(`[SEED-LOG] ✅ Mundo inicial completo.`);
}

module.exports = new UserService();