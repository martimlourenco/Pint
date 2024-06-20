const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: 'pint', 
    username: 'postgres', 
    password: '2004', 
    host: 'localhost', 
    port: 5432, 
    dialect: 'postgres' 
});

module.exports = sequelize;