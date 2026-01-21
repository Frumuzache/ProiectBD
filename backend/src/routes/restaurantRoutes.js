const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// III.a: Listare și sortare (Ex: /api/restaurants?sortBy=nota)
router.get('/', restaurantController.getAllRestaurants);

// III.d: Statistici restaurante (Funcții grup + HAVING)
router.get('/stats', restaurantController.getRestaurantStats);

// III.b: Editare restaurant după ID
router.put('/:id', restaurantController.updateRestaurant);

// III.b: Ștergere restaurant după ID
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;