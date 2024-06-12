//models/product.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')
const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        isHidden:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'product', // имя таблицы
        timestamps: false,
    }
);

module.exports = Product;