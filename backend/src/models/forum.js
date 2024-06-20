const Sequelize = require('sequelize');
const sequelize = require('./database');
const users = require('./users');

const Forum = sequelize.define('forum', {
    ID_FORUM: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    ID_FUNCIONARIO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: users,
            key: 'ID_FUNCIONARIO'
        }
    },
    NEVENTO: {
        type: Sequelize.NUMERIC,
        allowNull: false
    },
    DATAFORUM: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
    },
    DESCRICAO: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    freezeTableName: true
});
Forum.belongsTo(users, {foreignKey: 'ID_FUNCIONARIO'});
module.exports = Forum;
