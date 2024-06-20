const Locais = require('../models/locais'); 
const Area = require('../models/area'); 
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// Função para criar um novo local
const createLocal = async (req, res) => {
  const { ID_AREA, DESIGNACAO_LOCAL, LOCALIZACAO, REVIEW } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!ID_AREA || !DESIGNACAO_LOCAL || !LOCALIZACAO) {
      return res.status(400).json({ error: 'ID_AREA, DESIGNACAO_LOCAL e LOCALIZACAO são obrigatórios' });
  }

  try {
      const newLocal = await Locais.create({ ID_AREA, DESIGNACAO_LOCAL, LOCALIZACAO, REVIEW, foto });
      return res.status(201).json(newLocal);
  } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar o local' });
  }
};

// Função para listar todos os locais
const listLocais = async (req, res) => {
  try {
    const locais = await Locais.findAll({
      include: [{
        model: Area,
        attributes: ['NOME_AREA']
      }]
    });

    const locaisComFotoUrl = locais.map(local => {
      return {
        ...local.dataValues,
        fotoUrl: local.foto ? `${req.protocol}://${req.get('host')}/uploads/${local.foto}` : null
      };
    });

    return res.status(200).json(locaisComFotoUrl);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar os locais' });
  }
};

// Função para listar locais por área
const listLocaisByArea = async (req, res) => {
  const { id } = req.params;

  try {
    const locais = await Locais.findAll({
      where: { ID_AREA: id },
      include: [{
        model: Area,
        attributes: ['NOME_AREA']
      }]
    });

    if (locais.length === 0) {
      return res.status(404).json({ error: 'Nenhum local encontrado para esta área' });
    }

    const locaisComFotoUrl = locais.map(local => {
      return {
        ...local.dataValues,
        fotoUrl: local.foto ? `${req.protocol}://${req.get('host')}/uploads/${local.foto}` : null
      };
    });

    return res.status(200).json(locaisComFotoUrl);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar os locais por área' });
  }
};


// Função para obter detalhes de um local por ID
const getLocalById = async (req, res) => {
  const { id } = req.params;

  try {
    const local = await Locais.findByPk(id, {
      include: [{
        model: Area,
        attributes: ['NOME_AREA']
      }]
    });

    if (!local) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }

    const localComFotoUrl = {
      ...local.dataValues,
      fotoUrl: local.foto ? `${req.protocol}://${req.get('host')}/uploads/${local.foto}` : null
    };

    return res.status(200).json(localComFotoUrl);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter os detalhes do local' });
  }
};




// Função para editar um local por ID
const updateLocal = async (req, res) => {
  const { id } = req.params;
  const { ID_AREA, DESIGNACAO_LOCAL, LOCALIZACAO, REVIEW } = req.body;
  const foto = req.file ? req.file.filename : null;

  try {
      const local = await Locais.findByPk(id);
      if (!local) {
          return res.status(404).json({ error: 'Local não encontrado' });
      }

      local.ID_AREA = ID_AREA || local.ID_AREA;
      local.DESIGNACAO_LOCAL = DESIGNACAO_LOCAL || local.DESIGNACAO_LOCAL;
      local.LOCALIZACAO = LOCALIZACAO || local.LOCALIZACAO;
      local.REVIEW = REVIEW || local.REVIEW;
      local.foto = foto || local.foto;

      await local.save();
      return res.status(200).json(local);
  } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o local' });
  }
};

// Função para deletar um local por ID
const deleteLocal = async (req, res) => {
  const { id } = req.params;

  try {
      const local = await Locais.findByPk(id);
      if (!local) {
          return res.status(404).json({ error: 'Local não encontrado' });
      }

      await local.destroy();
      return res.status(200).json({ message: 'Local deletado com sucesso' });
  } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar o local' });
  }
};

module.exports = {
  createLocal,
  listLocais,
  getLocalById,
  updateLocal,
  deleteLocal,
  listLocaisByArea
};
