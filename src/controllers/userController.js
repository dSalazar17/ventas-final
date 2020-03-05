'use strict'

var User = require('../models/user')

async function registrar(req, res) {
    try {
        var user = new User()
        var { usuario_name, email, password } = req.body
        if(usuario_name && email && password) {
            user.usuario_name = usuario_name
            user.email = email
            user.rol = 'ROLE_ALUMNO'
            await User.find({ $or: [{ usuario: user.usuario_name }, { email: user.email }] }, (error, users) => {
                if(error) return res.status(400).send({ message: 'Bad Request' })
                if(users && users.length >= 1) {
                    return res.status(500).send({ message: 'El usuario ya existe.' })
                } else {
                    bcrypt.hash(password, null, null, async (error, hash) => {
                        if(error) res.status(500).send({ message: 'Unexpected Error' })
                        user.password = hash
                        await user.save((error, usuarioGuardado) => {
                            if(error) res.status(400).send({ message: 'Bad Request' })
                            if(usuarioGuardado) {
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