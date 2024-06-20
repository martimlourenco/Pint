const Sequelize = require('sequelize');
const sequelize = require('./database');
const Area = require('./area');

const Locais = sequelize.define('locais', {
    ID_LOCAL: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ID_AREA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Area,
            key: 'ID_AREA'
        }
    },
    DESIGNACAO_LOCAL: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    LOCALIZACAO: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    REVIEW: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: true
      }
}, {
    timestamps: false,
    freezeTableName: true
});

Locais.belongsTo(Area, {foreignKey: 'ID_AREA'});

module.exports = Locais;
