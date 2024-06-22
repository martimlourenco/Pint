const express = require('express');
const router = express.Router();
const eventoRoute = require('../controllers/eventosController');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/create', upload.single('foto'), eventoRoute.createEvento);
router.get('/list', eventoRoute.listEventos);
router.get('/listdisp', eventoRoute.listEventosDisp);
router.delete('/delete/:id', eventoRoute.deleteEvento);
router.put('/update/:id', eventoRoute.updateEvento);
router.get('/get/:id', eventoRoute.eventoDetail);
router.get('/criador/:ID_CRIADOR/eventos', eventoRoute.listarEventosCriador);

module.exports = router;