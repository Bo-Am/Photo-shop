const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

// RESTful. Папка controllers прописывается логика работы на ручках 
router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/info', auth, userCtrl.getUser)

router.patch('/addcart', auth, userCtrl.addCart)

module.exports = router
