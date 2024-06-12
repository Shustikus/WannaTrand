//routes/imageRouter.js
const Router = require('express')
const router = new Router
const imageController = require('../controllers/imageController')
const checkRoleMiddleware = require("../middleware/checkRoleMIddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), imageController.createImage)

router.put('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), imageController.updateImage);

router.delete('/', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), imageController.deleteImage)

router.delete('/deleteAll', authMiddleware, checkRoleMiddleware(['AUTHOR', 'ADMIN']), imageController.deleteAllImagesByProductId);

module.exports = router