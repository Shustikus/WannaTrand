//models/product_quantity.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')
const Product_quantity = sequelize.define(
    'Product_quantity',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        size: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'product_quantity', // имя таблицы
        timestamps: false,
    }
);

module.exports = Product_quantity;