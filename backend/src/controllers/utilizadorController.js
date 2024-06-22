const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../config');

const listarUsers = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
};

const getLoggedUser = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);
    const userId = decoded.user_id;

    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter o usuário logado:', error);
    res.status(500).json({ message: 'Erro ao obter o usuário logado.', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);
    const userId = decoded.user_id;

    const { user_name, user_mail, NIF, MORADA, NTELEMOVEL } = req.body;

    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.user_name = user_name;
    user.user_mail = user_mail;
    user.NIF = NIF;
    user.MORADA = MORADA;
    user.NTELEMOVEL = NTELEMOVEL;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar os dados do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar os dados do usuário.', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);
    const userId = req.params.id;

    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await user.destroy();

    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar o usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar o usuário.', error: error.message });
  }
};

module.exports = {
  listarUsers,
  getLoggedUser,
  updateUser,
  deleteUser
};