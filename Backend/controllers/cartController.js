//controllers/cartController.js
const ApiError = require('../error/ApiError');
const cartService = require('../service/cartService');

class CartController {
    async addToCart(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {product_id, size, quantity} = req.body;
            const cartItem = await cartService.addToCart(product_id, size, quantity, refreshToken);
            res.json(cartItem);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getCartItems(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const cartItem = await cartService.getCartItems(refreshToken)
            res.json(cartItem)
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async deleteCartItem(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {product_id, size} = req.params;
            const removedCartItem = await cartService.deleteCartItem(product_id, size, refreshToken);
            res.json(removedCartItem);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async clearCart(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await cartService.clearCart(refreshToken)
            res.json({message: 'Коризна очищена'})
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async updateCartItem(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {product_id, size, quantity} = req.body;
            const cartItem = await cartService.updateCartItem(refreshToken, product_id, size, quantity)
            res.json(cartItem)
        } catch (e) {
            next(ApiError.internal(e));
        }
    }
}

module.exports = new CartController()