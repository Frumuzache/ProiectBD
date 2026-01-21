const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// III.a: Listare și sortare (Ex: /api/reports?sortBy=id_comanda) [cite: 423]
router.get('/', reportController.getAllReports);

// Creare tichet nou
router.post('/', reportController.createReport);

// III.b: Editare descriere tichet [cite: 424]
router.put('/:id', reportController.updateReport);

// III.b: Ștergere tichet [cite: 424]
router.delete('/:id', reportController.deleteReport);

module.exports = router;