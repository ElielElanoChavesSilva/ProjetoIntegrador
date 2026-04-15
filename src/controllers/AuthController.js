const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // AQUI TAMBÉM: adicione o 'js'

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

class AuthController {
    async register(req, res) {
        const { nome, email, senha } = req.body;
        console.log(`[AUTH-LOG] 📝 Tentativa de cadastro: ${email}`);

        try {
            const userExists = await userService.findByEmail(email);
            if (userExists) {
                console.log(`[AUTH-LOG] ❌ Falha: E-mail ${email} já existe.`);
                return res.status(400).json({ error: "E-mail já cadastrado" });
            }

            const result = await userService.create({ nome, email, senha });
            console.log(`[AUTH-LOG] ✅ Sucesso: Usuário ${nome} criado (ID ${result.id})`);
            
            res.status(201).json({ 
                message: "Usuário criado com sucesso",
                userId: result.id 
            });
        } catch (error) {
            console.error(`[AUTH-ERROR] 💣 Erro no registro:`, error);
            res.status(500).json({ error: "Erro interno ao cadastrar" });
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;
        console.log(`[AUTH-LOG] 🔑 Tentativa de login: ${email}`);

        try {
            const user = await userService.findByEmail(email);

            if (!user || !(await bcrypt.compare(senha, user.Password))) {
                console.log(`[AUTH-LOG] ❌ Falha: Credenciais inválidas para ${email}`);
                return res.status(401).json({ error: "E-mail ou senha incorretos" });
            }

            const token = jwt.sign({ id: user.Id }, JWT_SECRET, { expiresIn: '1d' });

            console.log(`[AUTH-LOG] 🔓 Sucesso: ${user.Name} logado.`);

            res.json({
                token: token,
                usuario: {
                    id: user.Id,
                    nome: user.Name,
                    email: user.Email
                }
            });
        } catch (error) {
            console.error(`[AUTH-ERROR] 💣 Erro no login:`, error);
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
}

module.exports = new AuthController();