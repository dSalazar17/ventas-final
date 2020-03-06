'use strict'

const express = require('express')
const api = express.Router()
const UserController = require('../controllers/userController')
const md_auth = require('../middlewares/authenticated')

api.post('/registrar', UserController.registrar)
api.get('/login', UserController.login)
api.put('/editarUsuario', md_auth.ensureAuth, UserController.editAnythingUser)
api.delete('/eliminarUsuario',  md_auth.ensureAuth, UserController.deleteUser)
api.get('/Users', md_auth.ensureAuth, UserController.getUsers)

module.exports = api
