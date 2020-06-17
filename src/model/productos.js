const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productos = new Schema({
    nombre: {
        type: String,
        required: [true, 'El Nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es necesario']
    },
    disponilbe: {
        type: Boolean,
        required: [true, 'Campo necesario']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es necesaria']
    }
});

module.exports = mongoose.model('Productos', productos);