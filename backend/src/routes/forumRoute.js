const express = require('express');
const router = express.Router();
const createForum = require('../controllers/forumController');

router.post('/create', createForum.addForum);
router.get('/list', createForum.listarForums);
router.get('/listevento/:idEvento', createForum.listarForumsPorEvento);


module.exports = router;