const Forum = require('../models/forum');
const users = require('../models/users');


const addForum = async (req, res) => {
  const { ID_FUNCIONARIO, NEVENTO, DESCRICAO } = req.body;

  console.log('Recebendo requisição para adicionar comentário:', req.body);

  if (!ID_FUNCIONARIO || !NEVENTO || !DESCRICAO) {
      console.log('Campos obrigatórios faltando:', req.body);
      return res.status(400).json({ error: 'Por favor, forneça todos os campos obrigatórios.' });
  }

  try {
      const user = await users.findByPk(ID_FUNCIONARIO);
      if (!user) {
          console.log('Usuário não encontrado:', ID_FUNCIONARIO);
          return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const forum = await Forum.create({
          ID_FUNCIONARIO,
          NEVENTO,
          DATAFORUM: new Date(),
          DESCRICAO
      });

      console.log('Comentário criado com sucesso:', forum);
      res.status(201).json(forum);
  } catch (error) {
      console.error('Erro ao criar comentário:', error);
      res.status(500).json({ error: 'Ocorreu um erro ao criar o fórum.' });
  }
};

const listarForums = async (req, res) => {
    try {
        const forums = await Forum.findAll();
        res.status(200).json(forums);
    } catch (error) {
        console.error('Erro ao listar fóruns:', error);
        res.status(500).json({ message: 'Erro ao listar fóruns.', error: error.message });
    }
};

const listarForumsPorEvento = async (req, res) => {
    const { idEvento } = req.params;

    try {
        const forums = await Forum.findAll({
            where: { NEVENTO: idEvento },
            include: [users] // Inclui dados do usuário associado ao comentário
        });
        if (!forums.length) {
            return res.status(404).json({ error: 'Nenhum comentário encontrado para este evento.' });
        }
        res.status(200).json(forums);
    } catch (error) {
        console.error('Erro ao listar fóruns por evento:', error);
        res.status(500).json({ message: 'Erro ao listar fóruns por evento.', error: error.message });
    }
};

module.exports = {
    addForum,
    listarForums,
    listarForumsPorEvento
};
