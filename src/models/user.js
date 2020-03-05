'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = Schema({
    usuario_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    rol: String
})

module.exports = mongoose.model('user', schema)