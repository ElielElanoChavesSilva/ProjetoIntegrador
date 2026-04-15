const db = require('../database');

class MetadataController {
    // GET CATEGORIES: Filtra rigorosamente pelo grupo enviado
    async getCategories(req, res) {
        const { group } = req.query;
        console.log(`[METADATA-LOG] 🔎 Buscando categorias do local: '${group}'`);

        if (!group) return res.status(400).json({ error: "O parâmetro 'group' é obrigatório." });

        db.all("SELECT Nome FROM UserCategories WHERE (UserId = ? OR UserId IS NULL) AND GrupoNome = ?", 
        [req.userId, group], (err, rows) => {
            if (err) {
                console.error("[ERRO SQL] Falha ao buscar categorias:", err.message);
                return res.status(500).json({ error: "Erro interno no servidor." });
            }
            res.json(rows.map(r => r.Nome));
        });
    }

    // POST CATEGORY: Garante o vínculo antes de responder 201
    async addCategory(req, res) {
        const { nome, group } = req.body;
        
        if (!nome || !group) {
            return res.status(400).json({ error: "Nome e Group são obrigatórios para vincular a categoria." });
        }

        db.run("INSERT INTO UserCategories (Nome, GrupoNome, UserId) VALUES (?, ?, ?)", 
        [nome, group, req.userId], function(err) {
            if (err) {
                console.error("[ERRO] Falha ao salvar categoria:", err.message);
                return res.status(400).json({ error: "Não foi possível vincular a categoria ao grupo." });
            }
            console.log(`[METADATA-LOG] ✅ Categoria '${nome}' vinculada ao local '${group}'`);
            res.status(201).json({ id: this.lastID, nome, group });
        });
    }

    // GET PRODUCTS: Filtro duplo (Categoria + Grupo)
    async getProducts(req, res) {
        const { categoria, group } = req.query;
        console.log(`[METADATA-LOG] 🔎 Buscando produtos de: '${group}' > '${categoria}'`);

        if (!categoria || !group) return res.status(400).json({ error: "Categoria e Group são obrigatórios." });

        db.all("SELECT Nome FROM UserProducts WHERE (UserId = ? OR UserId IS NULL) AND CategoriaNome = ? AND GrupoNome = ?", 
        [req.userId, categoria, group], (err, rows) => {
            if (err) {
                console.error("[ERRO SQL] Falha ao buscar produtos:", err.message);
                return res.status(500).json({ error: "Erro interno no servidor." });
            }
            res.json(rows.map(r => r.Nome));
        });
    }

    // POST PRODUCT: Salva a árvore completa
    async addProduct(req, res) {
        const { nome, categoria, group } = req.body;
        
        if (!nome || !categoria || !group) {
            return res.status(400).json({ error: "Árvore de dados incompleta (nome/categoria/group)." });
        }

        db.run("INSERT INTO UserProducts (Nome, CategoriaNome, GrupoNome, UserId) VALUES (?, ?, ?, ?)", 
        [nome, categoria, group, req.userId], function(err) {
            if (err) return res.status(400).json({ error: "Erro ao salvar produto." });
            console.log(`[METADATA-LOG] ✅ Produto '${nome}' salvo em ${group} > ${categoria}`);
            res.status(201).json({ id: this.lastID, nome, categoria, group });
        });
    }

    // GET GROUPS (Locais)
    async getGroups(req, res) {
        db.all("SELECT Nome FROM UserGroups WHERE UserId = ? OR UserId IS NULL", [req.userId], (err, rows) => {
            if (err) return res.status(500).json({ error: "Erro ao buscar locais." });
            res.json(rows.map(r => r.Nome));
        });
    }

    async addGroup(req, res) {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ error: "Nome do local é obrigatório." });

        db.run("INSERT INTO UserGroups (Nome, UserId) VALUES (?, ?)", [nome, req.userId], function(err) {
            if (err) return res.status(400).json({ error: "Erro ao salvar local." });
            res.status(201).json({ id: this.lastID, nome });
        });
    }
}

module.exports = new MetadataController();