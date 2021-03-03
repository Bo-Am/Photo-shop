const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
  register: async (req, res)=>{
   try {
     const {name, email, password} = req.body
     const user = await Users.findOne({email})
     if(user) return res.status(400).json({msg:'The email already exists'})
     if(password.length < 6) return res.status(400).json({msg:'Password must contain 6 symbols'})

    //Шифрование пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = new Users ({
      name, email, password: passwordHash
    })

    // Сохранение пользователя в mongoDB
     await newUser.save()

    //  Создание токена для авторизации
    const accesstoken = createAccessToken({id: newUser._id})
    const refreshtoken = createRefreshToken({id: newUser._id})

    res.cookie('refreshtoken', refreshtoken, {
      httpOnly:true,
      path: '/user/refresh_token'
    })

     res.json({accesstoken})

   } catch (error) {
     return res.status(500).json({msg:error.message})
   }
  },

  login: async (req, res) => {
    try {
      // Из тела запроса берутся значения email и password
      const {email, password} = req.body
      // Находим в коллекции и заносим в переменную user, в случае, если его нет - выдать ошибку.
      const user = await Users.findOne({email})
      if(!user) return res.status(400).json({msg:'User does not exist'})
      // Расшифровываем пароль в коллекции и введенный пароль в теле запроса, в случае несовпадения выдать ошибку с сообщением
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) return res.status(400).json({msg:'Wrong password'})

      // если логин корректен, создать пользователю access refresh токены
      const accesstoken = createAccessToken({id: user._id})
      const refreshtoken = createRefreshToken({id: user._id})

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token'
      })

      res.json({accesstoken})


    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
  },

  logout: async(req, res)=> {
    try {
      res.clearCookie('refreshtoken', {path:'/user/refresh_token'})
      return res.json({msg: 'Logged out'})

    } catch (error) {
      return res.status(500).json({msg:error.message})
    }
  },

  refreshToken: (req, res) => {
    try {

      const rf_token = req.cookies.refreshtoken;
      if(!rf_token) return res.status(400).json({msg:'Please login or Register'})
      
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user)=> {
        if(error) return res.status(400).json({msg:'Please login or Register'})

        const accesstoken = createAccessToken({id:user.id})
        
        res.json({accesstoken})
      })

      
    } catch (error) {
      return res.status(500).json({msg:error.message})
    }
    
  },

  getUser: async(req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg: 'User does not exist'})

      res.json(user)
    } catch (error) {
      return res.status(500).json({msg:error.message})
    }
  },
  addCart: async(req, res) => {
    try {
      const user = await Users.findById(req.user.id)
      if(!user) return res.status(400).json({msg: 'User does not exist'})

      await Users.findOneAndUpdate({_id: req.user.id}, {
        cart: req.body.cart
      })

      return res.json({msg: 'Added to cart'})
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  }
} 

const createAccessToken = (user)=> {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user)=> {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = userCtrl
