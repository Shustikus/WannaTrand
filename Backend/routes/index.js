//routes/index.js
const Router = require('express')
const router = new Router
const brandRouter = require('./brandRouter')
const categoryRouter = require('./categoryRouter')
const imageRouter = require('./imageRouter')
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const favouriteRouter = require('./favouriteRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')

router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/image', imageRouter)
router.use('/product', productRouter)
router.use('/user', userRouter)
router.use('/favourite', favouriteRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)

module.exports = router