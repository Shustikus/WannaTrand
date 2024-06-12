//models/user.js
const {DataTypes} = require('sequelize');
const sequelize = require('../db/config')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        activationLink: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(255),
            defaultValue: "USER",
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true, // Разрешаем пустые значения
        },
        firstname: {
            type: DataTypes.STRING(255),
            allowNull: true, // Разрешаем пустые значения
        },
        lastname: {
            type: DataTypes.STRING(255),
            allowNull: true, // Разрешаем пустые значения
        },
        middlename: {
            type: DataTypes.STRING(255),
            allowNull: true, // Разрешаем пустые значения
        },
        birthday: {
            type: DataTypes.DATEONLY,
            allowNull: true, // Разрешаем пустые значения
        },
    },
    {
        // Эти настройки необходимы, если имена ваших таблиц в базе данных отличаются от имен ваших моделей
        freezeTableName: true, // использовать имя модели как имя таблицы
        tableName: 'user', // имя таблицы
        timestamps: false,
    }
);

module.exports = User;