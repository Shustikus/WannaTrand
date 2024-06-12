// service/orderService.js
const ApiError = require('../error/ApiError');
const {
    Order,
    Order_product,
    Cart,
    Product,
    Image,
    Order_delivery,
    Brand,
    Product_quantity
} = require('../models/index');
const tokenService = require("./tokenService");
const {User} = require("../models");

class OrderService {
    async createOrderWithProducts(refreshToken, status, amount, deliveryInfo) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        const user_id = token.user_id;

        // Получаем записи из таблицы "Cart" для указанного пользователя
        const cartItems = await Cart.findAll({
            where: {
                user_id,
            },
        });

        // Подготавливаем массив для хранения обновленных записей Product_quantity
        const updatedProductQuantities = [];

        // Создаем запись о доставке (Order_delivery)
        const delivery = await Order_delivery.create({
            country: deliveryInfo.country,
            city: deliveryInfo.city,
            zip_code: deliveryInfo.zip_code,
            address_line: deliveryInfo.address_line,
            house_number: deliveryInfo.house_number,
            flat_number: deliveryInfo.flat_number,
            delivery_type: deliveryInfo.delivery_type,
        });

        // Создаем нов заказ и передаем delivery_id
        const newOrder = await Order.create({
            user_id,
            status,
            amount,
            delivery_id: delivery.id, // Передаем ID созданной записи о доставке
        });

        // Обновляем записи в таблице "Product_quantity" и подготавливаем их для создания заказа
        await Promise.all(cartItems.map(async (cartItem) => {
            // Получаем запись о количестве товара
            const productQuantity = await Product_quantity.findOne({
                where: {
                    product_id: cartItem.product_id,
                    size: cartItem.size,
                },
            });

            // Проверяем, что запись о количестве товара существует и количество достаточно
            if (!productQuantity || productQuantity.quantity < cartItem.quantity) {
                throw new ApiError.badRequest('Недостаточно товара в наличии.');
            }

            // Обновляем количество товара в записи Product_quantity
            await productQuantity.update({
                quantity: productQuantity.quantity - cartItem.quantity,
            });

            // Добавляем обновленную запись Product_quantity в массив
            updatedProductQuantities.push(productQuantity);

            // Создаем запись в таблице "Order_product" для каждого элемента корзины
            const orderProducts = await Order_product.create({
                order_id: newOrder.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                size: cartItem.size,
            });

            return orderProducts;
        }));
        return {order: newOrder, delivery, updatedProductQuantities};
    }

    async getOrderProduct(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;
        // Найти все заказы пользователя по user_id
        const orders = await Order.findAll({
            where: {user_id},
            include: [
                {
                    model: Order_delivery, // Имя модели DeliveryOrder
                    as: 'Order_delivery', // Название связи (поле as в модели Order)
                }
            ]
        });
        // Для каждого заказа, получить соответствующие записи в таблице Order_product
        const orderProducts = await Promise.all(
            orders.map(async (order) => {
                const order_id = order.id;
                const products = await Order_product.findAll({
                    where: {order_id},
                    include: [
                        {
                            model: Product, // Имя модели Product
                            as: 'Product', // Название связи (поле as в модели Order_product)
                            include: [
                                {
                                    model: Image,
                                    as: 'Images',
                                    attributes: ["img"]
                                },
                                {
                                    model: Brand,
                                    as: 'Brand',
                                    attributes: ["brand_title"]
                                }
                            ]
                        }
                    ]
                });
                return {order, products}; // Возвращаем информацию о заказе и его продуктах
            })
        );
        return orderProducts;
    }

    async updateOrderStatus(refreshToken, orderId, status) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;
        const updatedOrder = await Order.update(
            {status},
            {
                where: {
                    id: orderId,
                    user_id
                }
            });
        if (updatedOrder[0] === 0) {
            throw ApiError.badRequest('Заказ не найден');
        }
        return updatedOrder;
    }

    async updateTrackingNumber(refreshToken, orderId, tracking_number) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError(); // Обработка случая, когда нет записи с указанным refreshToken
        }
        const user_id = token.user_id;
        const updatedOrder = await Order.update(
            {tracking_number},
            {
                where: {
                    id: orderId,
                    user_id
                }
            });
        if (updatedOrder[0] === 0) {
            throw ApiError.badRequest('Заказ не найден');
        }
        return updatedOrder;
    }

    async getAll() {
        const orders = await Order.findAll({
            include: [
                {
                    model: User, // Assuming there's a User model
                    as: 'User', // Assuming the association in the Order model is defined as 'User'
                    attributes: ['phone', 'lastname', 'firstname', 'middlename'], // Include only the necessary attributes
                },
                {
                    model: Order_delivery, // Имя модели DeliveryOrder
                    as: 'Order_delivery', // Название связи (поле as в модели Order)
                }
            ]
        });
        // Для каждого заказа, получить соответствующие записи в таблице Order_product
        const orderProducts = await Promise.all(
            orders.map(async (order) => {
                const order_id = order.id;
                const products = await Order_product.findAll({
                    where: {order_id},
                    include: [
                        {
                            model: Product, // Имя модели Product
                            as: 'Product', // Название связи (поле as в модели Order_product)
                            include: [
                                {
                                    model: Image,
                                    as: 'Images',
                                    attributes: ["img"],
                                },
                                {
                                    model: Brand,
                                    as: 'Brand',
                                    attributes: ["brand_title"]
                                },
                            ]
                        }
                    ]
                });
                return {order, products}; // Возвращаем информацию о заказе и его продуктах
            })
        );
        return orderProducts;
    }
}

module.exports = new OrderService();