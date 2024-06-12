//routes/brandRouter.js
const Router = require('express')
const router = new Router
const brandController = require('../controllers/brandController')
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMIddleware");

router.post('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), brandController.createBrand)
router.get('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), brandController.getBrandProductsAndOrders)
router.get('/all',authMiddleware, checkRoleMiddleware(['ADMIN']), brandController.getBrandsData)
router.get('/one',authMiddleware, checkRoleMiddleware(['AUTHOR']), brandController.getOneBrandData)
module.exports = router