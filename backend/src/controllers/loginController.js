const User = require('../models/users');
const Centro = require('../models/centro');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const create = async (req, res) => {
  const { user_name, user_mail, user_password, NIF, MORADA, NTELEMOVEL, DATAINICIO, ID_CENTRO } = req.body;

  if (!user_name || !user_mail || !user_password || !NIF || !DATAINICIO) {
    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    const existingUser = await User.findOne({ where: { user_mail } });

    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const newUser = await User.create({
      user_name,
      user_mail,
      user_password: hashedPassword,
      email_confirmed: false,
      NIF,
      MORADA,
      NTELEMOVEL,
      ADMINISTRADOR: false, 
      DATAINICIO,
      ID_CENTRO
    });

    res.status(201).json({ message: 'Usuário criado com sucesso.', user: newUser });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
  }
};

const login = async (req, res) => {
  const { user_mail, user_password } = req.body;

  if (!user_mail || !user_password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ where: { user_mail } });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ user_id: user.user_id, user_mail: user.user_mail }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login bem-sucedido.', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

const googleLogin = async (req, res) => {
  const { user_mail, user_name, user_photo } = req.body;

  try {
    let user = await User.findOne({ where: { user_mail } });

    if (!user) {
      user = await User.create({
        user_name,
        user_mail,
        user_password: null,
        email_confirmed: true,
      });
    }

    const token = jwt.sign({ user_id: user.user_id, user_mail: user.user_mail }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login com Google bem-sucedido.', token });
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    res.status(500).json({ message: 'Erro ao fazer login com Google.' });
  }
};

module.exports = {
  create,
  login,
  googleLogin,
};
