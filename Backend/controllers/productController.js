//controllers/productController.js
const ApiError = require('../error/ApiError')
const productService = require('../service/productService');

class ProductController {
    async create(req, res, next) {
        try {
            const {title, description, price, brand_id, category_id, image_id, quantities} = req.body;
            const product = await productService.createProduct(title, description, price, brand_id, category_id, image_id, quantities);
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateProductImage(req, res, next) {
        try {
            const {productId, newImageId} = req.body;
            const updatedProduct = await productService.updateProductImage(productId, newImageId);
            res.json(updatedProduct)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async toggleProductVisibility(req, res, next) {
        try {
            const {productId} = req.body
            const result = await productService.toggleProductVisibility(productId)
            res.json(result)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async productsWithImages(req, res, next) {
        try {
            const {category_id, page} = req.query;
            const products = await productService.getProductsByCategory(category_id, page);
            res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const product = await productService.getProductById(id);
            if (!product) {
                return ApiError.badRequest.json({message: 'Product not found'});
            }
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllByParentId(req, res, next) {
        try {
            const {parent_id} = req.params;
            const products = await productService.getProductsByParentId(parent_id);
            res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateProduct(req, res, next) {
        try {
            const {id} = req.params;
            const {title, description, price, category_id, image_id, quantities} = req.body;
            const updatedProduct = await productService.updateProduct(id, title, description, price, category_id, image_id, quantities);
            return res.json(updatedProduct);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getProductBrandId(req, res, next) {
        try {
            const {id} = req.params;
            const product = await productService.getProductBrandId(id);
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const products = await productService.getAll()
        return res.json(products)
    }

    async deleteProductById(req, res, next) {
        try {
            const {id} = req.body;
            const result = await productService.deleteProductById(id);
            res.json(result);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new ProductController()