'use strict'

const express = require('express')
const api = express.Router()
const CategoryController = require('../controllers/categoriesController')
const md_auth = require('../middlewares/authenticated')

api.post('/addCategory', md_auth.ensureAuth, CategoryController.addCategory)
api.put('/editCategory', md_auth.ensureAuth, CategoryController.editCategory)
api.get('/getCategories', CategoryController.getCategorys)
api.delete('/deleteCategory', md_auth.ensureAuth, CategoryController.deleteCategory)

module.exports = api
