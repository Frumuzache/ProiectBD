const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// III.f: Rută pentru vizualizarea simplă editabilă
router.get('/simple', viewController.getSimpleViews);

// III.f: Rută pentru vizualizarea complexă (Raport detaliat - read-only)
router.get('/complex', viewController.getComplexViews);

// III.f: Actualizare status prin vizualizare editabilă
router.put('/simple/:id', viewController.updateSimpleView);

// III.f: Ștergere prin vizualizare editabilă
router.delete('/simple/:id', viewController.deleteSimpleView);

// Legacy routes for compatibility
router.get('/compound', viewController.getCompoundView);
router.put('/compound-update', viewController.updateThroughView);

module.exports = router;