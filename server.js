require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')

// Подключение app путей и пакетов
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
  useTempFiles:true
}))

// Подключение ручек
app.use('/user', require('./routes/userRouter'))

// Подключение к mongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if(err) throw err;
  console.log('Connected to MongoDB')
})



// Запуск сервера
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> {
  console.log('Server running on port', PORT)
})
