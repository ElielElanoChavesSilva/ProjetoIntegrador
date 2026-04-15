const express = require('express');
const router = express.Router();
const MetadataController = require('../controllers/MetadataController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/groups', MetadataController.getGroups);
router.post('/groups', MetadataController.addGroup);

router.get('/categories', MetadataController.getCategories);
router.post('/categories', MetadataController.addCategory);

router.get('/products', MetadataController.getProducts);
router.post('/products', MetadataController.addProduct);

module.exports = router;