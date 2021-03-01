const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')

// RESTful. Папка controllers прописывается логика работы на ручках 
router.post('/register', userCtrl.register)

router.get('/refresh_token', userCtrl.refreshToken)

module.exports = router
