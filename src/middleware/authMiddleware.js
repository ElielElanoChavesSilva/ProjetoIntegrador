const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

module.exports = (req, res, next) => {
    // 1. Pega o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    console.log(`[MIDDLEWARE-LOG] Verificando acesso para rota: ${req.originalUrl}`);

    if (!authHeader) {
        console.log(`[MIDDLEWARE-LOG] Acesso negado: Token não fornecido.`);
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // 2. O formato esperado é "Bearer <TOKEN>", então dividimos a string
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.log(`[MIDDLEWARE-LOG] Acesso negado: Erro no formato do token.`);
        return res.status(401).json({ error: 'Erro no formato do token' });
    }

    const token = parts[1];

    // 3. Valida o Token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(`[MIDDLEWARE-LOG] Acesso negado: Token inválido ou expirado.`);
            return res.status(401).json({ error: 'Token inválido' });
        }

        // 4. Se chegou aqui, o token é válido! 
        // Salvamos o ID do usuário dentro da requisição para os próximos arquivos usarem
        req.userId = decoded.id;
        
        console.log(`[MIDDLEWARE-LOG] Acesso autorizado para Usuário ID: ${req.userId}`);
        
        return next();
    });
};