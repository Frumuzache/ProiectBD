const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Rută pentru listare și sortare (Ex: /api/delivery?sortBy=nume) 
router.get('/', deliveryController.getAllLivratori);

// Rută pentru adăugare livrator
router.post('/', deliveryController.createLivrator);

// Rută pentru editare înregistrare existentă 
router.put('/:id', deliveryController.updateLivrator);

// Rută pentru ștergere înregistrare 
router.delete('/:id', deliveryController.deleteLivrator);

module.exports = router;