'use strict'

const express = require('express')
const api = express.Router()
const ProductController = require('../controllers/productController')
const md_auth = require('../middlewares/authenticated')

api.post('/addProduct', md_auth.ensureAuth, ProductController.addProduct)
api.get('/getProducts', ProductController.getProducts)
api.put('/editProduct', md_auth.ensureAuth, ProductController.editProduct)
api.delete('/deleteProduct', md_auth.ensureAuth, ProductController.deleteProduct)
api.get('/outOfStock', ProductController.outOfStock)

module.exports = api

