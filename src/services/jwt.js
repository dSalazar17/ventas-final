'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

const secret = 'password'

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        usuario_name: user.usuario_name,
        email: user.email,
        cursos: user.cursos,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(payload, secret)
}
