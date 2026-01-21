const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// III.a: Listare și sortare (Ex: /api/products?sortBy=pret) [cite: 423]
router.get('/', productController.getAllProducts);

// III.d: Statistici nutriționale (Grupare & HAVING) [cite: 425]
router.get('/nutrition-stats', productController.getNutritionStats);

// III.b: Editare produs după ID [cite: 424]
router.put('/:id', productController.updateProduct);

// III.b: Ștergere produs după ID [cite: 424]
router.delete('/:id', productController.deleteProduct);

// Foarte important: Exportul pentru a fi utilizat în server.js
module.exports = router;