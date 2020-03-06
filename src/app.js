'use strict'

//VARIBLES GLOBALES
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

//CARGA DE RUTAS
var USER_ROUTES = require('./routes/userRoutes')
var CATEGORY_ROUTES = require('./routes/categoriesRoutes')
var PRODUCT_ROUTES = require('./routes/productRoutes')

//MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//RUTAS
app.use('/api', USER_ROUTES)
app.use('/api', CATEGORY_ROUTES)
app.use('/api', PRODUCT_ROUTES)

//EXPORTACIONES
module.exports = app;