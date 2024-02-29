const Router = require('express').Router
const router = new Router()
const userController = require('../controllers/user-controller')
const pizzaController = require('../controllers/pizza-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 12}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)
router.post('/addPizza', pizzaController.uploadPizza)
router.post('/removePizza', pizzaController.removePizza)
router.post('/updatePizza', pizzaController.updatePizza)
router.get('/pizzas', pizzaController.getPizzas)

module.exports = router
