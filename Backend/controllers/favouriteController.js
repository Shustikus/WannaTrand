// controllers/favouriteController.js
const ApiError = require('../error/ApiError');
const favouriteService = require('../service/favouriteService');

class FavouriteController {
    async addToFavourites(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {product_id} = req.body; // Получаем product_id из запроса
            const newFavourite = await favouriteService.addToFavourites(refreshToken, product_id);
            return res.json(newFavourite);
        } catch (e) {
            next(e);
        }
    }

    async removeFromFavourites(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {product_id} = req.body;
            const existingFavourite = await favouriteService.removeFromFavourites(refreshToken, product_id);
            return res.json(existingFavourite);
        } catch (e) {
            next(e)
        }
    }

    async deleteAllFavouriteProducts(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await favouriteService.deleteAllFavouriteProducts(refreshToken);
            res.json({message: 'Все продукты удалены из избранного'});
        } catch (e) {
            next(e);
        }
    }

    async getFavouriteProducts(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const favouriteProducts = await favouriteService.getFavouriteProducts(refreshToken);
            res.json(favouriteProducts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FavouriteController();
