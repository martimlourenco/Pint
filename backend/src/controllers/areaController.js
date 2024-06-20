const Area = require('../models/area');

// Função para criar uma nova área
const createArea = async (req, res) => {
    const { NOME_AREA } = req.body; 

    if (!NOME_AREA) {
        return res.status(400).json({ error: 'NOME_AREA é obrigatório' });
    }

    try {
        const newArea = await Area.create({ NOME_AREA });

        return res.status(201).json(newArea);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar a área' });
    }
};

// Função para listar todas as áreas
const listAreas = async (req, res) => {
    try {
        const areas = await Area.findAll();
        return res.status(200).json(areas);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar as áreas' });
    }
};

// Função para deletar uma área por ID
const deleteArea = async (req, res) => {
    const { id } = req.params;

    try {
        const area = await Area.findByPk(id);
        if (!area) {
            return res.status(404).json({ error: 'Área não encontrada' });
        }

        await area.destroy();
        return res.status(200).json({ message: 'Área deletada com sucesso' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar a área' });
    }
};

module.exports = {
    createArea,
    listAreas,
    deleteArea
};
