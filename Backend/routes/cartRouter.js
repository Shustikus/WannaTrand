//routes/cartRouter.js
const Router = require('express')
const router = new Router
const cartController = require('../controllers/cartController')
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, cartController.addToCart)
router.get('/', authMiddleware, cartController.getCartItems)
router.delete('/:product_id/:size', authMiddleware, cartController.deleteCartItem)
router.delete('/clear', authMiddleware, cartController.clearCart)
router.patch('/update', authMiddleware, cartController.updateCartItem)

module.exports = router