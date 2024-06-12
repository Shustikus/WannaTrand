//routes/categoryRouter.js
const Router = require('express')
const router = new Router
const categoryController = require('../controllers/categoryController')
const checkRole = require('../middleware/checkRoleMIddleware')

router.post('/', checkRole('ADMIN'), categoryController.create)
router.get('/', categoryController.getAll)
router.get('/sub/:parent_id', categoryController.getSub)
router.get('/convert/:name_en', categoryController.convertNameEnToId);
router.get('/:id', categoryController.getParentAndChildren);


module.exports = router