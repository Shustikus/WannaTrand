// service/cartService.js
const ApiError = require('../error/ApiError');
const {Cart, Product, Image, Product_quantity, Brand} = require('../models/index');
const tokenService = require("./tokenService");
const {Op} = require("sequelize");

class CartService {
    async addToCart(product_id, size, quantity, refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;

        // Находим запись о количестве товара по выбранному размеру
        const productQuantity = await Product_quantity.findOne({
            where: {
                product_id,
                size,
            },
        });

        // Проверяем, что запись о количестве товара существует и количество больше 0
        if (!productQuantity || productQuantity.quantity <= 0) {
            throw ApiError.forbidden('Товар с выбранным размером отсутствует в наличии.');
        }

        // Проверяем, есть ли товар уже в корзине
        const existingCartItem = await Cart.findOne({
            where: {
                user_id,
                product_id,
                size: {
                    [Op.like]: size,
                },
            },
        });

        // Если товар уже в корзине, обновляем количество
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + parseInt(quantity, 10);

            // Проверяем, что новое количество не превышает доступное количество товара
            if (newQuantity > productQuantity.quantity) {
                throw ApiError.forbidden('Недостаточно товара в наличии.');
            }

            // Обновляем количество в корзине
            await existingCartItem.update({
                quantity: newQuantity,
            });

            return existingCartItem;
        }

        // Если товара нет в корзине, создаем новую запись
        const cartItem = await Cart.create({
            user_id,
            product_id,
            size,
            quantity: parseInt(quantity, 10),
        });

        return cartItem;
    }

    async getCartItems(refreshToken) {
        const token = await tokenService.findToken(refreshToken)
        if (!token) {
            throw ApiError.unauthorizedError() // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id
        const cartItems = await Cart.findAll({
            where: {
                user_id,
            }, include: [{
                model: Product, include: [
                    {
                        model: Brand, // Предположим, что модель Brand правильно связана с моделью Product
                        attributes: ['brand_title'], // Выбираем только brand_title
                    },
                    Image
                ]
            }]
        });
        return cartItems;
    }

    async deleteCartItem(product_id, size, refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;
        const removedCartItem = await Cart.destroy({
            where: {
                user_id, product_id, size: {
                    [Op.like]: size,
                },
            },
        });
        if (removedCartItem) {
            return "Товар успешно удален";
        } else {
            throw ApiError.forbidden("Товар не найден");
        }
    }

    async clearCart(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;
        await Cart.destroy({
            where: {
                user_id
            }
        });
    }

    async updateCartItem(refreshToken, product_id, size, quantity) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        const user_id = token.user_id;
        // Получаем количество товара в таблице Product_quantity
        const productQuantity = await Product_quantity.findOne({
            attributes: ['quantity'],
            where: {
                product_id,
                size,
            },
        });
        // Проверяем, можно ли добавить товар в корзину
        if (quantity > productQuantity.quantity) {
            throw ApiError.forbidden('Недостаточное количество товара в наличии');
        }
        // Обновляем корзину, если проверка прошла успешно
        const [updatedRowCount] = await Cart.update(
            {qanutity},
            {
                where: {
                    user_id,
                    product_id,
                    size: {
                        [Op.like]: size,
                    },
                },
            }
        );
        if (updatedRowCount > 0) {
            return `Количество товара изменено на ${quantity}`;
        } else {
            throw ApiError.forbidden('Количество не поменялось');
        }
    }
}

module.exports = new CartService();