const Sequelize = require('sequelize');
const sequelize = require('./database');
const Forum = require('./forum');
const Centro = require('./centro');

const Comentarios = sequelize.define('comentarios', {
    ID_COMENTARIO: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ID_FORUM: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Forum,
            key: 'ID_FORUM'
        }
    },
    ID_CENTRO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Centro,
            key: 'ID_CENTRO'
        }
    },
    DESCRICAO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DATA_COMENTARIO: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ID_FUNCIONARIO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ID_RECOMENDACAO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    AVALIACAO: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    freezeTableName: true
});

Comentarios.belongsTo(Forum, {foreignKey: 'ID_FORUM'});
Comentarios.belongsTo(Centro, {foreignKey: 'ID_CENTRO'});
module.exports = Comentarios;
