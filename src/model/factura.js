const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let factura = new Schema({
    nombreCliente: {
        type: String,
        required: [true, 'El nombre del cliente es necesario']
    },
    rtn: {
        type: String,
        required: [true, 'El rtn es necesario']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es necesaria']
    },
    subTotal: {
        type: Number,
        required: [true, 'El subTotal es necesario']
    },
    imp: {
        type: Number,
        required: [true, 'El impuesto es necesario']
    },
    total: {
        type: Number,
        required: [true, 'El Total es necesario']
    },
    pdf: {
        type: String
    }
});

module.exports = mongoose.model('Factura', factura);