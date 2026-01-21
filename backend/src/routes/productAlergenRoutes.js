const express = require('express');
const router = express.Router();
const controller = require('../controllers/productAlergenController');

router.get('/', controller.getAllProductAlergens);

module.exports = router;