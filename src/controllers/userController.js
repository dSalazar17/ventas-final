'use strict'

var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

async function registrar(req, res) {
    try {
        var user = new User()
        var { usuario_name, email, password, rol } = req.body
        if (usuario_name && email && password) {
            user.usuario_name = usuario_name
            user.email = email
            user.rol = rol
            await User.find({ $or: [{ usuario: user.usuario_name }, { email: user.email }] }, (error, users) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (users && users.length >= 1) {
                    return res.status(500).send({ message: 'El usuario ya existe.' })
                } else {
                    bcrypt.hash(password, null, null, async (error, hash) => {
                        if (error) res.status(500).send({ message: 'Unexpected Error' })
                        user.password = hash
                        await user.save((error, usuarioGuardado) => {
                            if (error) res.status(400).send({ message: 'Bad Request' })
                            if (usuarioGuardado) {
                                res.status(201).send({ message: 'Success', usuario: usuarioGuardado })
                            } else {
                                res.status(400).send({ message: 'Unexpected Error' })
                            }
                        })
                    })
                }
            })
        } else {
            res.status(400).send({ message: 'Missing Data' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: error.message })
    }
}

async function login(req, res) {
    try {
        const { email, password, token } = req.body
        await User.findOne({ email: email }, (error, usuario) => {
            if (error) res.status(400).send({ message: 'Bad Request' })
            if (usuario) {
                bcrypt.compare(password, usuario.password, (error, checked) => {
                    if (error) res.status(500).send({ message: 'Unexpected Error' })
                    if (checked) {
                        if (token) {
                            res.status(200).send({ message: 'Usuario Logeado', token: jwt.createToken(usuario) })
                        } else {
                            usuario.password = undefined
                            res.status(200).send({ user: usuario })
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no se ha podido identificar' })
                    }
                })
            } else {
                res.status(404).send({ message: 'Not Found' })
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: error.message })
    }
}

async function editAnythingUser(req, res) {
    try {
        const { _id, usuario_name, email, rol } = req.body
        let updateUser = {}
        if (req.user.rol === 'ADMIN') {
            await User.findOne({ _id: _id }).exec(async (error, userFinded) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!userFinded) return res.status(404).send({ message: 'Not Found' })
                if (userFinded.rol === 'ADMIN') {
                    return res.status(400).send({ message: 'No se puede editar a un administrador' })
                } else {
                    if (usuario_name) updateUser.usuario_name = usuario_name
                    if (email) updateUser.email = email
                    if (rol) updateUser.rol = rol
                    await User.findByIdAndUpdate(_id, updateUser, { new: true }, (error, updatedUser) => {
                        if (error) return res.status(400).send({ message: 'Bad Request' })
                        if (!updatedUser) return res.status(404).send({ message: 'Not Found' })
                        return res.status(200).send({ message: 'Usuario Actualizado', user: updatedUser })
                    })
                }
            })
        } else {
            return res.status(403).send({ message: 'No posee los privilegios necesarios' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: error.message })
    }
}

async function deleteUser(req, res) {
    try {
        const { _id } = req.body
        if (req.user.rol === 'ADMIN' && _id) {
            await User.findOne({ _id: _id }).exec(async (error, userFinded) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!userFinded) return res.status(404).send({ message: 'Not Found' })
                if (userFinded.rol === 'ADMIN') {
                    return res.status(401).send({ message: 'No puedes eliminar un Administrador' })
                } else {
                    await User.findByIdAndDelete(_id, (error, deletedUser) => {
                        if (error) return res.status(400).send({ message: 'Bad Request' })
                        if (!deleteUser) return res.status(404).send({ message: 'Not Found' })
                        return res.status(200).send({ message: 'Usuario Eliminado', user: deletedUser })
                    })
                }
            })
        } else if (req.user.rol === 'CLIENT') {
            await User.findByIdAndDelete(req.user.sub, (error, deletedUser) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!deleteUser) return res.status(404).send({ message: 'Not Found' })
                return res.status(200).send({ message: 'Usuario Eliminado', user: deletedUser })
            })
        } else {
            return res.status(401).send({ message: 'No puedes eliminar tu cuenta, eres un administrador' })
        }
    } catch (error) {
        console.error(error)
        return res.status5(500).send({ error: error.message })
    }
}

async function getUsers(req, res) {
    try {
        if (req.user.rol === 'ADMIN') {
            await User.find({ rol: 'CLIENT' }).exec((error, users) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!users) return res.status(404).send({ message: 'Not Found' })
                return res.status(200).send({ message: 'Success', users: users })
            })
        } else {
            await User.find({ _id: req.user.sub }).exec((error, users) => {
                if (error) return res.status(400).send({ message: 'Bad Request' })
                if (!users) return res.status(404).send({ message: 'Not Found' })
                return res.status(200).send({ message: 'Success', user: users })
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    registrar,
    login,
    editAnythingUser,
    deleteUser,
    getUsers
}