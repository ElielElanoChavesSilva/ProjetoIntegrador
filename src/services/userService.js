const db = require('../database');
const bcrypt = require('bcryptjs'); // AQUI É O SEGREDO: precisa ter o 'js' no final

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
        
        // Criptografando a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        return new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)",
                [nome, email, senhaCriptografada],
                function(err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID });
                }
            );
        });
    }
}

module.exports = new UserService();