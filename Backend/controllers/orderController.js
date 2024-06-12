//controllers/orderController.js
const ApiError = require('../error/ApiError');
const orderService = require('../service/orderService');

class OrderController {
    async createOrderWithProducts(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {status, amount, deliveryInfo} = req.body;
            const result = await orderService.createOrderWithProducts(refreshToken, status, amount, deliveryInfo);
            res.json(result);
        } catch (error) {
            next(ApiError.internal(error));
        }
    }

    async getOrderProduct(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const orderProducts = await orderService.getOrderProduct(refreshToken);
            res.json(orderProducts);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async updateOrderStatus(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {orderId, status} = req.body;
            const updatedOrder = await orderService.updateOrderStatus(refreshToken, orderId, status);
            res.json(updatedOrder);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async updateTrackingNumber(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {orderId, tracking_number} = req.body;
            const updatedOrder = await orderService.updateTrackingNumber(refreshToken, orderId, tracking_number);
            res.json(updatedOrder);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getAll(req, res, next) {
        const orders = await orderService.getAll()
        res.json(orders)
    }

}

module.exports = new OrderController()