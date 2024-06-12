// service/productService.js
const ApiError = require('../error/ApiError');
const {Category, Product, Image, Brand, Product_quantity} = require('../models/index');

class ProductService {
    async createProduct(title, description, price, brand_id, category_id, image_id, quantities) {
        let createdProduct;
        await Product.create({
            title,
            description,
            price,
            brand_id,
            category_id,
            image_id,
            isHidden: false
        }).then((product) => {
            createdProduct = product;

            // Создаем записи в таблице Product_quantity для каждого размера
            const sizePromises = quantities.map(({size, quantity}) =>
                Product_quantity.create({
                    size,
                    quantity: quantity || 0,
                    product_id: product.id
                })
            );

            return Promise.all(sizePromises);
        });

        return createdProduct;
    }

    async updateProductImage(productId, newImageId) {
        const product = await Product.findByPk(productId);

        product.image_id = newImageId;
        await product.save();

        return product;
    }

    async toggleProductVisibility(productId) {
        const product = await Product.findByPk(productId)
        product.isHidden = !product.isHidden
        await product.save()
        return {success: true, message: `Видимость продукта успешно изменена`};
    }

    async getProductsByCategory(category_id, page, limit) {
        page = page || 1;
        limit = parseInt(limit) || 3;
        const offset = page * limit - limit;
        const whereCondition = category_id ? {category_id, isHidden: false} : {isHidden: false};
        const products = await Product.findAll({
            where: whereCondition,
            limit,
            offset,
            include: [
                {
                    model: Image,
                    attributes: ["img"],
                },
                {
                    model: Category,
                    attributes: ["parent_id"],
                },
            ],
        });
        return products;
    }

    async getProductById(id) {
        const product = await Product.findOne({
            where: {id},
            include: [
                {
                    model: Image,
                    as: 'Images',
                    attributes: ['id', 'img'],
                },
                {
                    model: Brand,
                    as: 'Brand',
                    attributes: ['brand_title']
                },
                {
                    model: Product_quantity,
                    as: 'Product_quantities',
                    attributes: ['quantity', 'size']
                }
            ],
        });
        return product;
    }

    async getProductsByParentId(parent_id) {
        const products = await Product.findAll({
            where: {isHidden: false},
            include: [
                {
                    model: Category,
                    where: {parent_id},
                },
                {
                    model: Image,
                    attributes: ["img"],
                },
            ],
        });
        return products;
    }

    async updateProduct(id, title, description, price, category_id, image_id, quantities) {
        const existingProduct = await Product.findByPk(id);

        await existingProduct.update({
            title,
            description,
            price,
            category_id,
            image_id,
        });

        await Promise.all(quantities.map(async ({size, quantity}) => {
            const existingProductQuantity = await Product_quantity.findOne({
                where: {
                    product_id: id,
                    size,
                }
            });
            if (existingProductQuantity) {
                await existingProductQuantity.update({quantity});
            } else {
                await Product_quantity.create({
                    product_id: id,
                    size,
                    quantity,
                });
            }
        }));
        return this.getProductById(id);
    }

    async getProductBrandId(id) {
        const product = await Product.findOne({
            where: {id},
            include: [
                {
                    model: Brand,
                    as: 'Brand',
                    attributes: ['id']
                }
            ]
        });
        return product?.Brand?.id || null;
    }

    async getAll() {
        const products = await Product.findAll({
            include: [
                {
                    model: Image,
                    attributes: ["img"],
                },
                {
                    model: Brand,
                    as: 'Brand',
                    attributes: ['brand_title']
                },
                {
                    model: Category,
                    attributes: ["name"],
                },
            ],
        });
        return products;
    }

    async deleteProductById(id) {
        // Находим продукт по id
        const product = await Product.findByPk(id);
        if (!product) {
            throw ApiError.internal(`Продукт с ID ${id} не найден`);
        }

        // Удаляем связанные записи из Product_quantity
        await Product_quantity.destroy({
            where: {
                product_id: id
            }
        });

        // Удаляем сам продукт
        await product.destroy();
        return {success: true, message: 'Продукт и связанные данные успешно удалены'};
    }

}

module.exports = new ProductService();