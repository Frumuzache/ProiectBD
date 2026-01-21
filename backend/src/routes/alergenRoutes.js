const express = require('express');
const router = express.Router();
const alergenController = require('../controllers/alergenController');

// Rută pentru listare (Ex: /api/alergeni?sortBy=id_alergen)
router.get('/', alergenController.getAllAlergeni);

// Rută pentru adăugare
router.post('/', alergenController.createAlergen);

// Rută pentru editare după ID
router.put('/:id', alergenController.updateAlergen);

// Rută pentru ștergere după ID
router.delete('/:id', alergenController.deleteAlergen);

module.exports = router;