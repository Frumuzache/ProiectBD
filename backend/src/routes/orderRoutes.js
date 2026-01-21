const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// III.a: Listare și sortare (Ex: /api/orders?sortBy=status)
router.get('/', orderController.getAllOrders);

// III.c: Raport detaliat (3 tabele)
router.get('/detailed', orderController.getDetailedOrders);

// III.b: Editare comandă
router.put('/:id', orderController.updateOrder);

// III.b & III.e: Ștergere (Exemplificare Cascade)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;