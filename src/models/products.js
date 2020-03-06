'use strict'

const moongose = require('mongoose')
const Schema = moongose.Schema

const schema = Schema({
    product_name: {type: String},
    stock: {type: Number},
    description: {type: String},
})

module.exports = moongose.model('products', schema)