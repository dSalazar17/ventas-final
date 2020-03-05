'use strict'

const mongoose = require("mongoose")
const app = require("./app")

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/control-empresa', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Conexión exitosa')

    app.set('port', process.env.PORT || 4000)
    app.listen(app.get('port'), ()=>{
        console.log(`El proyecto está corriendo en el puerto: ${app.get('port')}`)
    })
}).catch(err => console.log(err))