//controllers/brandController.js
const ApiError = require('../error/ApiError');
const brandService = require('../service/brandService');

class BrandController {
    async createBrand(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const {brand_title, brand_description, brand_representativeInfo} = req.body;
            const brand = await brandService.createBrand(brand_title, brand_description, brand_representativeInfo, refreshToken);
            res.json(brand);
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getBrandProductsAndOrders(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const brand_products = await brandService.getBrandProductsAndOrders(refreshToken)
            res.json(brand_products)
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getBrandsData(req, res) {
        const brands = await brandService.getBrandsData()
        res.json(brands)
    }

    async getOneBrandData(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const brand = await brandService.getOneBrandData(refreshToken)
            res.json(brand)
        } catch (e) {
            next(ApiError.internal(e));
        }
    }
}

module.exports = new BrandController()