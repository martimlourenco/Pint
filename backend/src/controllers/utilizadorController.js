const User  = require('../models/users');

const listarUser = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
};

module.exports = {
  listarUser,
};
