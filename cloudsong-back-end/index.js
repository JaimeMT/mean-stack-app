'use strict'

const mongoose = require('mongoose');
const app = require('./app')
const port = process.env.PORT || 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyecto-mean', {useFindAndModify: false}, (err, res) => {
    if(err){
        throw err
    }else{
        console.log('La conexion a la base de datos esta corriendo correctamente')
        app.listen(port, function(){
            console.log("Servidor escuchando en el puerto", port);
        })
    }
})