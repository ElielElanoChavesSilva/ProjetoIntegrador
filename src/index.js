require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const shoppingRoutes = require('./routes/shoppingList');
const metadataRoutes = require('./routes/metadata'); // Novo!

const app = express();

app.use(cors());
app.use(express.json());

// Registro das Rotas
app.use('/api/auth', authRoutes);
app.use('/api/shopping-list', shoppingRoutes);
app.use('/api', metadataRoutes); // Agrupa /groups, /categories, /products

app.get('/', (req, res) => res.json({ message: "API Lista de Compras V2 Online!" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`✅ Suporte a Grupos, Categorias e Produtos Personalizados Ativado.`);
});