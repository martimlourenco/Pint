const ParticipantesEvento = require('../models/participantes_evento');
const Evento = require('../models/eventos');
const User = require('../models/users')

// Adicionar participante a um evento
exports.createParticipante = async (req, res) => {
    const { ID_FUNCIONARIO, ID_EVENTO } = req.body;

    try {
        const participante = await ParticipantesEvento.create({ ID_FUNCIONARIO, ID_EVENTO });
        res.status(201).json(participante);
    } catch (error) {
        console.error('Erro ao adicionar participante:', error);
        res.status(500).json({ error: 'Erro ao adicionar participante.' });
    }
};

// Editar participante de um evento (nota: geralmente não se edita relacionamentos, então esse endpoint pode ser opcional)
exports.updateParticipante = async (req, res) => {
    const { ID_FUNCIONARIO, ID_EVENTO } = req.params;
    const { newID_FUNCIONARIO, newID_EVENTO } = req.body;

    try {
        const participante = await ParticipantesEvento.findOne({ where: { ID_FUNCIONARIO, ID_EVENTO } });

        if (participante) {
            participante.ID_FUNCIONARIO = newID_FUNCIONARIO || participante.ID_FUNCIONARIO;
            participante.ID_EVENTO = newID_EVENTO || participante.ID_EVENTO;
            await participante.save();
            res.status(200).json(participante);
        } else {
            res.status(404).json({ error: 'Participante não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao editar participante:', error);
        res.status(500).json({ error: 'Erro ao editar participante.' });
    }
};

// Remover participante de um evento
exports.deleteParticipante = async (req, res) => {
    const { ID_FUNCIONARIO, ID_EVENTO } = req.params;

    try {
        const rowsDeleted = await ParticipantesEvento.destroy({ where: { ID_FUNCIONARIO, ID_EVENTO } });

        if (rowsDeleted > 0) {
            res.status(200).json({ message: 'Participante removido com sucesso.' });
        } else {
            res.status(404).json({ error: 'Participante não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao remover participante:', error);
        res.status(500).json({ error: 'Erro ao remover participante.' });
    }
};

exports.listarParticipantesEvento = async (req, res) => {
    const { ID_EVENTO } = req.params;

    try {
        const participantes = await ParticipantesEvento.findAll({
            where: { ID_EVENTO },
            include: [
                {
                    model: User,
                    attributes: ['ID_FUNCIONARIO', 'user_name', 'user_mail'] // Apenas os campos necessários do Funcionario
                }
            ],
            attributes: [] // Apenas os campos padrão de ParticipantesEvento serão incluídos
        });

        res.status(200).json(participantes);
    } catch (error) {
        console.error('Erro ao listar participantes do evento:', error);
        res.status(500).json({ error: 'Erro ao listar participantes do evento.' });
    }
};

exports.listarEventosFuncionario = async (req, res) => {
    const { ID_FUNCIONARIO } = req.params;

    try {
        const eventos = await ParticipantesEvento.findAll({
            where: {
                ID_FUNCIONARIO
            },
            include: [
                {
                    model: Evento
                }
            ]
        });

        res.status(200).json(eventos);
    } catch (error) {
        console.error('Erro ao listar eventos do funcionário:', error);
        res.status(500).json({ error: 'Erro ao listar eventos do funcionário.' });
    }
};