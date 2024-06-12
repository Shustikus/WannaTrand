//routes/cartRouter.js
const Router = require('express')
const router = new Router
const orderController = require('../controllers/orderController')
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMIddleware");

router.post('/', authMiddleware, orderController.createOrderWithProducts)
router.get('/', authMiddleware, orderController.getOrderProduct)
router.patch('/update', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), orderController.updateOrderStatus)
router.patch('/update/tracking_number', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), orderController.updateTrackingNumber)
router.get('/all', authMiddleware, checkRoleMiddleware(['ADMIN']), orderController.getAll)

module.exports = router