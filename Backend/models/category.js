    //models/category.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name_en:{
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'category', // имя таблицы
        timestamps: false,
    }
);

module.exports = Category;