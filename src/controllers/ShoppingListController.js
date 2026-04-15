const shoppingService = require('../services/shoppingListService');

class ShoppingListController {
    async getAll(req, res) {
        try {
            const items = await shoppingService.listByUser(req.userId);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar lista" });
        }
    }

    async create(req, res) {
        try {
            const newItem = await shoppingService.add(req.userId, req.body);
            res.status(201).json(newItem);
        } catch (error) {
            res.status(400).json({ error: "Erro ao adicionar item" });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            await shoppingService.update(id, req.userId, req.body);
            res.json({ message: "Item atualizado" });
        } catch (error) {
            res.status(400).json({ error: "Erro ao atualizar item" });
        }
    }

    // NOVA FUNÇÃO: Toggle
    async toggle(req, res) {
        const { id } = req.params;
        console.log(`[LOG] App alternando status (Peguei) do item ID: ${id} (Usuário: ${req.userId})`);
        
        try {
            const updatedItem = await shoppingService.toggle(id, req.userId);
            res.status(200).json(updatedItem); // Devolve o JSON exato que o Android pediu!
        } catch (error) {
            console.error(`[ERRO] Falha no toggle:`, error.message);
            if (error.message === "Acesso Negado ou Item Inexistente.") {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro interno ao marcar item" });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            await shoppingService.delete(id, req.userId);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: "Erro ao deletar item" });
        }
    }
}

module.exports = new ShoppingListController();