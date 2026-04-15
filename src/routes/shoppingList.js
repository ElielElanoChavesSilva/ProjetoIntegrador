const express = require('express');
const router = express.Router();
const ShoppingListController = require('../controllers/ShoppingListController');

// 👇 ATENÇÃO: Verifique se sua pasta se chama 'middleware' ou 'middlewares'
const authMiddleware = require('../middleware/authMiddleware');

// Exige o Token JWT
router.use(authMiddleware);

// Casando a rota com a função exata do Controller
router.get('/', ShoppingListController.getAll);
router.post('/', ShoppingListController.create);
router.put('/:id', ShoppingListController.update);
router.delete('/:id', ShoppingListController.delete);

// 👇 AQUI ESTÁ A ROTA QUE FALTAVA! O botão "Peguei!" do Kotlin bate aqui
router.patch('/:id/toggle', ShoppingListController.toggle);

module.exports = router;