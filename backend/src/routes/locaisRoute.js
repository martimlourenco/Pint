const express = require('express');
const router = express.Router();
const localRoute = require('../controllers/locaisController');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/create', upload.single('foto'), localRoute.createLocal);
router.get('/list', localRoute.listLocais);
router.put('/edit', localRoute.updateLocal);
router.get('/get/:id', localRoute.getLocalById);
router.delete('/delete/:id', localRoute.deleteLocal);
router.get('/listarea/:id', localRoute.listLocaisByArea);

module.exports = router;
