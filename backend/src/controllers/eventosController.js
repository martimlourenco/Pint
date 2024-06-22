const Eventos = require('../models/eventos');
const Centro = require('../models/centro');
const Users = require('../models/users');
const AlbumFotos = require('../models/albumFotos');
const Forum = require('../models/forum');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Locais = require('../models/locais');

const upload = multer({ dest: 'uploads/' });

const createEvento = async (req, res) => {
  try {
    const {
      ID_CENTRO,
      ID_CRIADOR,
      ID_FORUM,
      NOME_EVENTO,
      TIPO_EVENTO,
      DATA_EVENTO,
      DISPONIBILIDADE,
      LOCALIZACAO,
      TIPO_AREA,
      N_PARTICIPANTSE,
      ID_APROVADOR,
    } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!ID_CENTRO  || !ID_CRIADOR || !NOME_EVENTO || !TIPO_EVENTO || !DATA_EVENTO) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }

    const foto = req.file.path; 

    const novoEvento = await Eventos.create({
      ID_CENTRO,
      ID_CRIADOR,
      ID_FORUM,
      NOME_EVENTO,
      TIPO_EVENTO,
      DATA_EVENTO,
      DISPONIBILIDADE,
      LOCALIZACAO,
      TIPO_AREA,
      N_PARTICIPANTSE,
      ID_APROVADOR,
      foto
    });

    res.status(201).json(novoEvento);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
};

// Outros controladores permanecem inalterados

const eventoDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await Eventos.findByPk(id, {
      include: [
        { model: Centro },
        { model: Users },
        { model: Forum }
      ]
    });
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(evento);
  } catch (err) {
    console.error('Erro ao encontrar detalhes do evento:', err);
    res.status(500).json({ error: 'Erro ao encontrar detalhes do evento' });
  }
};

// Listar todos os eventos
const listEventos = async (req, res) => {
  try {
    const eventos = await Eventos.findAll();

    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ message: 'Erro ao listar eventos.', error: error.message });
  }
};

const listEventosDisp = async (req, res) => {
  try {
    const eventos = await Eventos.findAll({
      where: {
        DISPONIBILIDADE: true
      },
      attributes: [
        'ID_EVENTO',
        'ID_CENTRO',
        'ID_CRIADOR',
        'ID_FORUM',
        'NOME_EVENTO',
        'TIPO_EVENTO',
        'DATA_EVENTO',
        'DISPONIBILIDADE',
        'LOCALIZACAO',
        'TIPO_AREA',
        'N_PARTICIPANTSE',
        'ID_APROVADOR',
        'foto'
      ]
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ message: 'Erro ao listar eventos.', error: error.message });
  }
};

// Atualizar um evento
const updateEvento = async (req, res) => {
  const eventoId = req.params.id;
  const {
    ID_CENTRO,
    ID_CRIADOR,
    ID_FORUM,
    NOME_EVENTO,
    TIPO_EVENTO,
    DATA_EVENTO,
    DISPONIBILIDADE,
    LOCALIZACAO,
    TIPO_AREA,
    N_PARTICIPANTES,
    ID_APROVADOR
  } = req.body;

  try {
    let evento = await Eventos.findByPk(eventoId);

    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    evento.ID_CENTRO = ID_CENTRO || evento.ID_CENTRO;
    evento.ID_CRIADOR = ID_CRIADOR || evento.ID_CRIADOR;
    evento.ID_FORUM = ID_FORUM || evento.ID_FORUM;
    evento.NOME_EVENTO = NOME_EVENTO || evento.NOME_EVENTO;
    evento.TIPO_EVENTO = TIPO_EVENTO || evento.TIPO_EVENTO;
    evento.DATA_EVENTO = DATA_EVENTO || evento.DATA_EVENTO;
    evento.DISPONIBILIDADE = DISPONIBILIDADE || evento.DISPONIBILIDADE;
    evento.LOCALIZACAO = LOCALIZACAO || evento.LOCALIZACAO;
    evento.TIPO_AREA = TIPO_AREA || evento.TIPO_AREA;
    evento.N_PARTICIPANTES = N_PARTICIPANTES || evento.N_PARTICIPANTES;
    evento.ID_APROVADOR = ID_APROVADOR || evento.ID_APROVADOR;

    await evento.save();

    res.status(200).json({ message: 'Evento atualizado com sucesso.', evento });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro ao atualizar evento.', error: error.message });
  }
};

// Deletar um evento
const deleteEvento = async (req, res) => {
  const eventoId = req.params.id;

  try {
    const evento = await Eventos.findByPk(eventoId);

    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado.' });
    }

    await evento.destroy();

    res.status(200).json({ message: 'Evento eliminado com sucesso.' });
  } catch (error) {
    console.error('Erro ao eliminar evento:', error);
    res.status(500).json({ message: 'Erro ao eliminar evento.', error: error.message });
  }
};

const listarEventosCriador = async (req, res) => {
  const { ID_CRIADOR } = req.params;

  try {
    const eventos = await Eventos.findAll({
      where: {
        ID_CRIADOR
      }
    });

    if (!eventos.length) {
      return res.status(404).json({ message: 'Nenhum evento encontrado para este criador.' });
    }

    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos do criador:', error);
    res.status(500).json({ message: 'Erro ao listar eventos do criador.', error: error.message });
  }
};

module.exports = { createEvento, listEventos, updateEvento, deleteEvento, eventoDetail, listEventosDisp, listarEventosCriador };
