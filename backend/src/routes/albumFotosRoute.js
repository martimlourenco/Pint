const express = require('express');
const albumFotosController = require('../controllers/albumFotosController');
const router = express.Router();

router.post('/create', albumFotosController.addAlbum);
router.get('/list', albumFotosController.listarAlbums);


module.exports = router;