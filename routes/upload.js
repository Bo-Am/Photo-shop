const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

// Загрузка картинок через cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// Загрузка картинки(только admin)
router.post('/upload', auth, authAdmin, (req,res) => {
  try {
    console.log(req.files)
    if(!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({msg:'No files were uploaded'})
    }
    const file = req.files.file
    // если файл больше определенного размера и не опредленного формата(mimetype) то выдать ошибку
    if(file.size > 1024*1024) {
      removeTmp(file.tempFilePath)
      return res.status(400).json({msg: 'Size too large'})
    }

    if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath)
      return res.status(400).json({msg: 'File format is incorrect'})
    }

    // Встроенные методы загрузки (в папку 'test' будет загружаться картинка cloudinary)
    cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: 'test'
    }, async(err, result)=> {
      if(err) throw err;

      removeTmp(file.tempFilePath)

      res.json({public_id: result.public_id, url: result.secure_url})
    } )

    
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }
})


// Удаление картинки(только admin)
router.post('/destroy', auth, authAdmin, (req, res) => {
  try {
    const {public_id} = req.body 
    if(!public_id)
      return res.status(400).json({msg: 'No image Selected'})

      cloudinary.v2.uploader.destroy(public_id, async(err, result)=>{
        if(err) throw err

        res.json({msg: 'Deleted Image'})
      })
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }

})


// После загрузки картинок попадают в папку tmp; функция removeTmp не допускает загрузку картинок в tmp
const removeTmp = (path)=>{
  fs.unlink(path, err =>{
    if(err) throw err
  })
}

module.exports = router 
