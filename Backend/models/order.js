//models/order.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const Order = sequelize.define(
    'Order',
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
        delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "создан"
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        tracking_number:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'order', // имя таблицы
        timestamps: true,
    }
);

module.exports = Order;