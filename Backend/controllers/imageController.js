//controllers/imageController.js
const uuid = require('uuid')
const path = require('path')
const fs = require('fs/promises');
const {Image} = require('../models/index')
const ApiError = require('../error/ApiError')

class ImageController {
    async createImage(req, res, next) {
        try {
            const {img} = req.files;
            const {product_id} = req.body; // Получаем product_id из параметров запроса
            if (!product_id) {
                ApiError.badRequest('Missing product_id parameter');
            }
            const fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            // Создаем изображение с указанием product_id
            const image = await Image.create({img: fileName, product_id});
            return res.json(image);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateImage(req, res, next) {
        try {
            const {id} = req.body;
            const {img} = req.files;

            if (img.size > 500 * 1024) {
                return res.status(400).json({error: 'File size exceeds 500 KB limit'});
            }
            // Генерируем уникальное имя файла для обновленного изображения
            const fileName = uuid.v4() + ".jpg";

            // Перемещаем загруженное изображение в статическую папку с новым именем файла
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            // Получаем существующую запись изображения из базы данных
            const existingImage = await Image.findByPk(id);

            if (!existingImage) {
                ApiError.internal('Изображение не найдено');
            }

            // Удаляем старый файл изображения из статической папки
            const oldFilePath = path.resolve(__dirname, '..', 'static', existingImage.img);
            await fs.unlink(oldFilePath);

            // Обновляем запись изображения в базе данных новым именем файла
            await existingImage.update({img: fileName});

            return res.json(existingImage);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteImage(req, res, next) {
        try {
            const {id} = req.body;

            // Получаем запись изображения из базы данных
            const imageToDelete = await Image.findByPk(id);

            if (!imageToDelete) {
                ApiError.internal('Изображение не найдено');
            }

            // Удаляем файл изображения из статической папки
            const filePath = path.resolve(__dirname, '..', 'static', imageToDelete.img);
            await fs.unlink(filePath);

            // Удаляем запись изображения из базы данных
            await imageToDelete.destroy();

            return res.json({message: 'Изображение успешно удалено'});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteAllImagesByProductId(req, res, next) {
        try {
            const {product_id} = req.body;

            if (!product_id) {
                return res.status(400).json({error: 'Missing product_id parameter'});
            }

            // Находим все записи изображений с заданным product_id
            const imagesToDelete = await Image.findAll({
                where: {product_id},
            });

            if (!imagesToDelete || imagesToDelete.length === 0) {
                return res.status(404).json({error: 'No images found for the given product_id'});
            }

            // Удаляем файлы изображений из статической папки
            for (const imageToDelete of imagesToDelete) {
                const filePath = path.resolve(__dirname, '..', 'static', imageToDelete.img);
                await fs.unlink(filePath);
            }

            // Удаляем записи изображений из базы данных
            await Image.destroy({
                where: {product_id},
            });

            return res.json({message: 'Все изображения успешно удалены'});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new ImageController()