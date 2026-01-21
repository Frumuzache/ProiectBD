const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// III.a: Listare și sortare (Ex: /api/users?sortBy=nume) 
router.get('/', userController.getAllUsers);

// Creare utilizator nou
router.post('/', userController.createUser);

// III.b: Editare utilizator după ID [cite: 424]
router.put('/:id', userController.updateUser);

// III.b: Ștergere utilizator după ID [cite: 424]
router.delete('/:id', userController.deleteUser);

module.exports = router;