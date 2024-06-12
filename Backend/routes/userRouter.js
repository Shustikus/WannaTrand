//routes/userRouter.js
const Router = require('express')
const router = new Router
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {body} = require('express-validator')
const checkRoleMiddleware = require("../middleware/checkRoleMIddleware");

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/user-info', authMiddleware, userController.getUserInfo)
router.put('/user-info-update', authMiddleware, userController.updateUserInfo)
router.delete(`/delete`, authMiddleware, userController.deleteAccount)
router.post(`/change-password`, authMiddleware, userController.changePassword)

router.patch(`/accept`, authMiddleware, checkRoleMiddleware(['ADMIN']), userController.acceptBrand)

module.exports = router