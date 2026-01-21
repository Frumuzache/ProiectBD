const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderItemController');

router.get('/', controller.getAllOrderItems);

module.exports = router;