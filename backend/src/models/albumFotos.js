const Sequelize = require('sequelize');
const sequelize = require('./database');

const AlbumFotos = sequelize.define('albumfotos', {
    ID_ALBUM: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = AlbumFotos;
