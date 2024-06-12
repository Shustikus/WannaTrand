//models/order_product.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Order_product = sequelize.define(
    'Order_product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        size: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'order_product', // имя таблицы
        timestamps: false,
    }
);

module.exports = Order_product;