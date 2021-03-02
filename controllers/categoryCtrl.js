const Category = require('../models/categoryModel')


const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find()
      res.json(categories)
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  createCategory: async (req, res) => {
    try {
      // если role = 1, то это admin
      // Только admin может создавать, удалять и изменять категории
      res.json('Check admin success')
      const {name} = req.body
      const category = await Category.findOne({name})
      if(category) return res.status(400).json({msg:'This category already exist'})

      const newCategory = new Category({name})

      await newCategory.save()

      res.json('Create a category')

    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id)
      res.json({msg: 'Deleted a Category'})

    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  updateCategory: async (req, res) => {
    try {
      const {name} = req.body
      await Category.findByIdAndUpdate({_id: req.params.id}, {name})
      res.json('Update a category')
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  }

}

module.exports = categoryCtrl
