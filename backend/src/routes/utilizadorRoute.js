const express = require('express');
const router = express.Router();
const userRoute = require('../controllers/utilizadorController');

router.get('/list', userRoute.listarUser);

module.exports = router;