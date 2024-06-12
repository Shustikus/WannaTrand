// service/favouriteService.js
const ApiError = require('../error/ApiError');
const {Favourite, Product, Image} = require('../models/index');
const tokenService = require("./tokenService");

class FavouriteService {
    async addToFavourites(refreshToken, product_id) {
        // Получаем user_id с использованием сервиса FavouriteService
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id
        // Проверяем, не существует ли уже записи в избранном для данного пользователя и продукта
        const existingFavourite = await Favourite.findOne({
            where: {
                user_id,
                product_id,
            },
        });
        if (existingFavourite) {
            throw ApiError.badRequest('Продукт уже добавлен в избранное');
        }
        // Создаем новую запись в избранном
        const newFavourite = await Favourite.create({
            user_id,
            product_id,
        });
        return newFavourite;
    }

    async removeFromFavourites(refreshToken, product_id) {
        // Получаем user_id с использованием сервиса FavouriteService
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id
        const existingFavourite = await Favourite.findOne({
            where: {
                user_id,
                product_id,
            },
        });
        if (!existingFavourite) {
            throw ApiError.badRequest('Продукт не найден в избранном');
        }
        await existingFavourite.destroy();
        return existingFavourite;
    }

    async getFavouriteProducts(refreshToken) {
        // Получаем user_id с использованием сервиса FavouriteService
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id
        const favouriteProducts = await Favourite.findAll({
            where: {
                user_id,
            },
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: Image,
                            as: 'Images',
                            attributes: ["img"],
                        },
                    ],
                },
            ],
        });
        return favouriteProducts;
    }

    async deleteAllFavouriteProducts(refreshToken) {
        // Получаем user_id с использованием сервиса FavouriteService
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id
        // Удаляем все записи из избранного для данного пользователя
        await Favourite.destroy({
            where: {
                user_id,
            },
        });
    }

}

module.exports = new FavouriteService();