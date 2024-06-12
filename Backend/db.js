//db.js
const mysql = require('mysql2');
const util = require('util');

let connection;

// Функция для подключения к базе данных
const connect = async () => {
    if (connection && connection.state !== 'disconnected') {
        // Если подключение уже существует и не отключено, используем его
        return;
    }

    // Создаем новое подключение
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306,
    });

    // Превращаем метод connect в промис-версию
    const connectPromise = util.promisify(connection.connect).bind(connection);

    try {
        await connectPromise();
    } catch (err) {
        console.error('Ошибка при подключении к базе данных:', err);
        throw err;
    }

    console.log('Успешно подключено с ID ' + connection.threadId);
};

module.exports = {connect};