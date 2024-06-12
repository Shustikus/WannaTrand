//models/token.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')
const Token = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING(255),
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'token', // имя таблицы
        timestamps: false, // Включить метки времени
    }
);

module.exports = Token;