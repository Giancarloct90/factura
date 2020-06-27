const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let detalleFactura = new Schema({
    facturaId: {
        type: String,
        required: [true, 'El id fe factura es necesario']
    },
    nombreProducto: {
        type: String,
        required: [true, 'El nombre de producto es necesario']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es obligatoria']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio es nobligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    }
});

module.exports = mongoose.model('DetalleFactura', detalleFactura);