// server.js
require('dotenv').config()
const express = require('express')
const db = require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 7000
const app = express()

const corsOptions = {
    origin: 'http://localhost:5173', // Замените на ваш домен клиента
    credentials: true, // Разрешить передачу куки
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({limits: {fileSize: 800 * 1024}}));
app.use(cookieParser());
app.use('/api', router);


// Обработка ошибок, Middleware
app.use(errorHandler)

const start = async () => {
    try {
        // Подключение к базе данных
        await db.connect();

        // Запуск сервера после подключения к базе данных
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
