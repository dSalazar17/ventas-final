'use strict'

const moongose = require('mongoose')
const Schema = moongose.Schema

const schema = Schema({
    category_name: { type: String, required: true },
    description: { type: String, require: true },
    listProducts: [{
        type: Schema.Types.ObjectId, ref: 'products'
    }]
})

module.exports = moongose.model('categories', schema)