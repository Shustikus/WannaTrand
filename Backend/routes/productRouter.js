//routes/productRouter.js
const Router = require('express')
const router = new Router
const productController = require('../controllers/productController')
const checkRoleMiddleware = require("../middleware/checkRoleMIddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', checkRoleMiddleware(['AUTHOR', 'ADMIN']), productController.create)
router.post('/update', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), productController.updateProductImage)

router.get('/', productController.productsWithImages)
router.get('/all', authMiddleware, checkRoleMiddleware(['ADMIN']), productController.getAll)
router.get('/parent/:parent_id', productController.getAllByParentId);
router.get('/:id', productController.getOne)
router.get('/:id/brand', productController.getProductBrandId)

router.put('/:id', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), productController.updateProduct)
router.put('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), productController.toggleProductVisibility)

router.delete('/',authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), productController.deleteProductById)

module.exports = router