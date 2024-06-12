// service/brandService.js
const ApiError = require('../error/ApiError');
const {Brand, Product, Image, Order, Order_product, Order_delivery, Category, User} = require('../models/index');
const tokenService = require("./tokenService");
const {Op} = require("sequelize");

class BrandService {
    async createBrand(brand_title, brand_description, brand_representativeInfo, refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        const user_id = token.user_id;
        // Найти существующий бренд для данного пользователя
        let brand = await Brand.findOne({
            where: {
                user_id
            },
        });
        // Если бренд существует, обновить его, иначе создать новый
        if (brand) {
            brand = await brand.update({
                user_id,
                brand_title,
                brand_description
            });
            return {brand, message: 'Обновлена информация о бренде'};
        } else {
            brand = await Brand.create({
                user_id,
                brand_title,
                brand_description,
                brand_representativeInfo
            });
        }
        return {brand, message: 'Бренд создан'};
    }

    async getBrandProductsAndOrders(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        const user_id = token.user_id;

        const brand = await Brand.findOne({where: {user_id}});

        if (!brand) {
            throw ApiError.forbidden("Brand not found");
        }

        const brand_id = brand.id;

        const products = await Product.findAll({
            where: {brand_id},
            include: [
                {model: Category, as: 'Category', attributes: ['name']},
                {model: Image, as: 'Images', attributes: ['img']}
            ]
        });

        const productIds = products.map((product) => product.id);

        const orders = await Order.findAll({
            include: [
                {
                    model: User, // Assuming there's a User model
                    as: 'User', // Assuming the association in the Order model is defined as 'User'
                    attributes: ['phone', 'lastname', 'firstname', 'middlename'], // Include only the necessary attributes
                },
                {model: Order_delivery, as: 'Order_delivery'},
                {
                    model: Order_product,
                    as: 'Order_product',
                    where: {product_id: {[Op.in]: productIds}},
                    include: [
                        {
                            model: Product,
                            as: 'Product',
                            include: [
                                {model: Category, as: 'Category', attributes: ['name']},
                                {model: Image, as: 'Images', attributes: ['img']}
                            ]
                        }
                    ]
                }
            ]
        });
        return {brand, products, orders};
    }

    async getBrandsData() {
        const brands = await Brand.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ["id", "email", "isActivated"]
                }
            ]
        })
        return brands
    }

    async getOneBrandData(refreshToken) {
        const token = await tokenService.findToken(refreshToken);
        if (!token) {
            throw ApiError.unauthorizedError();
        }
        const user_id = token.user_id;
        return await Brand.findOne({where: {user_id}})
    }
}

module.exports = new BrandService();