//models/favouriteService.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Favourite = sequelize.define(
    'Favourite',
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
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'favourite', // имя таблицы
        timestamps: false,
    }
);

module.exports = Favourite;