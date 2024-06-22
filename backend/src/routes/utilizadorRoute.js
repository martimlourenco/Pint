const express = require('express');
const router = express.Router();
const { listarUsers, getLoggedUser, updateUser, deleteUser } = require('../controllers/utilizadorController');


// Rota para listar todos os usuários
router.get('/list', listarUsers);

// Rota para obter o usuário logado
router.get('/profile', getLoggedUser);
router.put('/profileup', updateUser);
router.delete('/delete/:id', deleteUser);
module.exports = router;
