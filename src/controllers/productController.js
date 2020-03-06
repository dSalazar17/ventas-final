'use strict'

var User = require('../models/user')
var Product = require('../models/products')
var Category = require('../models/categories')

async function addProduct(req, res) {
    try {
        if (req.user.rol === 'ADMIN') {
            const product = new Product()
            let { product_name, stock, description, categoria } = req.body

            if (product_name) {
                product.product_name = product_name
                product.stock = stock
                product.description = description

                await Product.find({ $or: [{ product_name: product.product_name }] }, (error, products) => {
                    if (error) return res.status(400).send({ message: 'Bad Request' })
                    if (products && products.length >= 1) {
                        return res.status(500).send({ message: 'Este producto ya se ha registrado' })
                    } else {
                        product.save((error, addProduct) => {
                            if (error) return res.status(500).send({ message: 'No se ha podido completar la petición' })
                            Category.findOneAndUpdate({ category_name: categoria }, { $push: { listProducts: addProduct._id } }, { new: true }, (error, saveProduct) => {
                                if (error) return res.status(400).send({ message: 'No se ha podido agregar a la categoría' })
                                if (!saveProduct) return res.status(404).send({ message: 'No se ha podido crear el producto' })
                                return res.status(201).send({ message: 'El producto se ha agregado', nuevo_producto: addProduct })
                            })
                        })
                    }
                })
            } else {
                res.status(500).send({ message: 'El servidor no puede completar la petición' })
            }

        } else {
            return res.send(401).send({ message: 'No tienes lo privilegios para agregar productos' })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'Missing data' })

    }
}

async function editProduct(req, res) {
    try {
        const { _id, product_name, description, stock } = req.body
        let updateProduct = {}

        if (req.user.rol === 'ADMIN') {
            if (product_name) updateProduct.product_name = product_name
            if (stock) updateProduct.stock = stock
            if (description) updateProduct.description = description

            await Product.findByIdAndUpdate(_id, updateProduct, { new: true }, (error, updateProduct) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!updateProduct) return res.status(404).send({ message: 'Not Found' })
                return res.status(200).send({ message: 'Producto actualizado', Product: updateProduct })
            })
        } else {
            return res.status(403).send({ message: 'No posee los privilegios necesarios' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })

    }
}

async function getProducts(req, res) {
    try {
        await Product.find((error, result) => {
            if (error) return res.status(400).send({ message: 'Error en la petición' })
            if (!result) return res.status(404).send({ message: 'Error al mostrar los productos' })
            return res.status(200).send({ message: 'Listado de productos', Listado_Products: result })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}

async function deleteProduct(req, res) {
    try {
        const { _id } = req.body
        if (req.user.rol === 'ADMIN' && _id) {
            await Product.findByIdAndDelete(_id, async (error, deleteCategory) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!deleteCategory) return res.status(404).send({ message: 'Not Found' })
                await Category.updateOne({ listProducts: _id }, { $pull: { listProducts: _id } })
                await Category.updateMany({ listProducts: _id }, { $pull: { listProducts: _id } })
                return res.status(200).send({ message: 'Categoria Eliminado', category: deleteCategory })
            })
        } else {
            return res.status(401).send({ message: 'Solo los administradores puede eliminar categorias' })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: error.message })
    }
}

async function outOfStock(req, res) {
    try {
        await Product.find((error, result) => {
            if (error) return res.status(400).send({ message: 'Error en la petición' })
            if (!result) return res.status(404).send({ message: 'Error al mostrar los productos' })
            return res.status(200).send({ message: 'Listado de productos', Listado_Products: result })
        }).populate(['stock'])
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    addProduct,
    editProduct,
    getProducts,
    deleteProduct,
    outOfStock
}