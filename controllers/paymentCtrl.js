const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')

const paymentCtrl = {
  getPayments: async(req, res) => {
    try {
      const payment = await Payments.find()
      res.json(payment)
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },
  createPayment: async(req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('name email')
      if(!user) return res.status(400).json({msg: 'User does not exist'})

      const {cart, paymentID, address} = req.body
      const {_id, name, email} = user

      const newPayment = new Payment({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address
      })

      res.json({newPayment})



    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  }
}

module.exports = paymentCtrl
