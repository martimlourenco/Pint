const AlbumFotos = require('../models/albumFotos');

const addAlbum = async (req, res) => {
    try {
        const album = await AlbumFotos.create({});

        res.status(201).json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao criar o álbum de fotos.' });
    }
};

const listarAlbums = async (req, res) => {
  try {
    const albums = await AlbumFotos.findAll();
    res.status(200).json(albums);
  } catch (error) {
    console.error('Erro ao listar álbuns de fotos:', error);
    res.status(500).json({ message: 'Erro ao listar álbuns de fotos.', error: error.message });
  }
};

module.exports = {
  addAlbum,
  listarAlbums,
};
