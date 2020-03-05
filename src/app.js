'use strict'

//VARIBLES GLOBALES
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')

//CARGA DE RUTAS

//MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//RUTAS

//EXPORTACIONES
module.exports = app;