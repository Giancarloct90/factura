const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let inventario = new Schema({
    productId: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    cantidad: {
        type: String,
        required: [true, 'La cantidad es necesaria']
    }
});

module.exports = mongoose.model('Inventario', inventario);