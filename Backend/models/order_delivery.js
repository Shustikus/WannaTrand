//models/order_delivery.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Order_delivery = sequelize.define(
    'Order_delivery',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        zip_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        address_line: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        house_number: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        flat_number: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        delivery_type: {
            type: DataTypes.STRING(50),
            defaultValue: "До дома",
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'order_delivery', // имя таблицы
        timestamps: false,
    }
);

module.exports = Order_delivery;