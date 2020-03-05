'use strict'

const mongoose = require("mongoose")
const app = require("./app")
const ACTUAL_DATE = new Date()

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/control-empresa', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log(`${ACTUAL_DATE} ==>`)

    app.set('port', process.env.PORT || 4000)
    app.listen(app.get('port'), ()=>{
        console.log(`Proyecto final Corriendo en el puerto: ${app.get('port')}`)
    })
}).catch(err => console.log(err))