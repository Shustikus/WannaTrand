//models/brand.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Brand = sequelize.define(
    'Brand',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        brand_title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        brand_description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        brand_representativeInfo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'brand', // имя таблицы
        timestamps: false,
    }
);

module.exports = Brand;