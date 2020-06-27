const express = require('express');
router = express.Router();
const Factura = require('../model/factura');
const DetalleFactura = require('../model/detalleFactura');
const {
    generatePDF
} = require('./utils/utils');


// TO VIEW THE FIRTS PAGE
router.get('/ventas', (req, res) => {
    res.render('ventas');
});

// TO GET FACTURA
router.post('/factura', async (req, res) => {
    // DESTRUCT VAR
    let {
        nombre,
        rtn,
        fecha,
        detalle,
        subtot,
        impuesto
    } = req.body;
    let detalles = [];

    // TRY TO INSERT INTO FACTURA
    try {
        let pdname = `${nombre}-${new Date().getTime()}`;
        let factura = new Factura();
        factura.nombreCliente = nombre;
        factura.rtn = rtn;
        factura.fecha = fecha;
        factura.subTotal = subtot;
        factura.imp = impuesto;
        factura.pdf = pdname;
        factura.total = (parseFloat(subtot) + parseFloat(impuesto));
        let facturaDB = await factura.save();
        if (!facturaDB) {
            res.status(500).json({
                ok: false,
                message: 'Error Server'
            });
        }

        // TRYING TO INSERT INTO DETALLE DE FACTURA
        detalle.map((det) => {
            detalles.push({
                facturaId: facturaDB._id,
                nombreProducto: det[0],
                precioUni: det[1],
                cantidad: det[2],
                total: det[3]
            });
        });
        let detalleFactura = new DetalleFactura();
        let detalleFacturaDB = await detalleFactura.collection.insertMany(detalles);
        if (!detalleFacturaDB) {
            res.status.json({
                ok: false,
                message: 'Error Server'
            });
        }

        // TRYING TO CREATE A PDF
        console.log(await generatePDF(pdname, detalleFacturaDB, facturaDB));
        res.status(200).json({
            ok: true,
            message: 'success',
            pdf: pdname
        });

    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error Factura'
        });
        console.log('Error tratando de guardar la factura', e);
    }
});

module.exports = router;