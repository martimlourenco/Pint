const Comentario = require('../models/comentario');

const comentarioController = {
  async comentario_list(req, res) {
    try {
      const comentarios = await Comentario.findAll();
      res.json(comentarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar comentários.' });
    }
  },

  async comentario_detail(req, res) {
    try {
      const comentario = await Comentario.findByPk(req.params.id);
      if (comentario) {
        res.json(comentario);
      } else {
        res.status(404).json({ message: 'Comentário não encontrado.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter detalhes do comentário.' });
    }
  },

  async comentario_create(req, res) {
    try {
      const comentario = await Comentario.create(req.body);
      res.json(comentario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar comentário.' });
    }
  },

  async comentario_update(req, res) {
    try {
      await Comentario.update(req.body, { where: { id: req.params.id } });
      const comentario = await Comentario.findByPk(req.params.id);
      res.json(comentario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar comentário.' });
    }
  },

  async comentario_delete(req, res) {
    try {
      await Comentario.destroy({ where: { id: req.params.id } });
      res.json({ message: 'Comentário excluído com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir comentário.' });
    }
  },
};

module.exports = comentarioController;
