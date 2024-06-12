//routes/favouriteRouter.js
const Router = require('express')
const router = new Router
const favouriteController = require('../controllers/favouriteController')
const authMiddleware = require("../middleware/authMiddleware");

router.get('/', authMiddleware, favouriteController.getFavouriteProducts);
router.post('/add', authMiddleware, favouriteController.addToFavourites);
router.post('/remove', authMiddleware, favouriteController.removeFromFavourites);
// router.delete('/delete-all', authMiddleware, favouriteController.deleteAllFavouriteProducts);

module.exports = router