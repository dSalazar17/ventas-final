'use strict'

var User = require('../models/user')
var Product = require('../models/products')
var Category = require('../models/categories')

async function addCategory(req, res) {
    try {
        if (req.user.rol === 'ADMIN') {
            const category = new Category()
            let { category_name, description } = req.body

            if (category_name && description) {
                category.category_name = category_name
                category.description = description

                await Category.find({ $or: [{ category_name: category.category_name }] }, (error, categories) => {
                    if (error) return res.status(400).send({ message: 'Bad Request' })
                    if (categories && categories.length >= 1) {
                        return res.status(500).send({ message: 'No se puede repetir categorías' })
                    } else {
                        category.save((error, categoriaSave) => {
                            if (error) res.status(400).send({ message: 'Bad Request' })
                            if (categoriaSave) {
                                res.status(201).send({ message: 'Success', categoria: categoriaSave })
                            } else {
                                return res.status(400).send({ message: 'Unexpected Error' })
                            }
                        })
                    }
                })
            } else {
                res.status(400).send({ message: 'Missing Data' })
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: error.message })
    }
}

async function editCategory(req, res) {
    try {
        const { _id, category_name, description } = req.body
        let updateCategory = {}

        if (req.user.rol === 'ADMIN') {
            if (category_name) updateCategory.category_name = category_name
            if (description) updateCategory.description = description

            await Category.findByIdAndUpdate(_id, updateCategory, { new: true }, (error, updateCategories) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!updateCategories) return res.status(404).send({ message: 'Not Found' })
                return res.status(200).send({ message: 'Categoría Actualizado', Category: updateCategories })
            })
        } else {
            return res.status(403).send({ message: 'No posee los privilegios necesarios' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })

    }
}

async function getCategorys(req, res) {
    try {
        await Category.find((error, result) => {
            if (error) return res.status(500).send({ message: 'Error en la petición' })
            if (!result) return res.status(404).send({ message: 'Error al mostrar las categorias' })
            return res.status(200).send({ message: 'Listado de productos', Listado_Categorias: result })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}

async function deleteCategory(req, res) {
    try {
        const { _id } = req.body
        if (req.user.rol === 'ADMIN' && _id) {
            await Category.findByIdAndDelete(_id, async(error, deleteCategory) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!deleteCategory) return res.status(404).send({ message: 'Not Found' })
                await Category.updateOne({category_name: 'default'}, {$push: {listProducts: deleteCategory.listProducts}})
                return res.status(200).send({ message: 'Categoria Eliminado', category: deleteCategory })
            })
        } else {
            return res.status(401).send({message: 'Solo los administradores puede eliminar categorias'})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: error.message})
    }
}

module.exports = {
    addCategory,
    editCategory,
    deleteCategory,
    getCategorys
}