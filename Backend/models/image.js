//models/image.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Image = sequelize.define(
    'Image',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        img: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'image', // имя таблицы
        timestamps: false
    }
);

module.exports = Image;