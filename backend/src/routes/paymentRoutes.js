const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// III.a: Listare și sortare (Ex: /api/payments?sortBy=ramas_de_plata)
router.get('/', paymentController.getAllPayments);

// Înregistrare plată nouă
router.post('/', paymentController.createPayment);

// III.b: Editare plată după ID
router.put('/:id', paymentController.updatePayment);

// III.b: Ștergere plată după ID
router.delete('/:id', paymentController.deletePayment);

module.exports = router;