const express = require('express');
const router = express.Router();
const Facturas = require('../model/factura');

// to VIEW THE PAGE
router.get('/facturas', (req, res) => {
    res.render('factura');
});

// TO GET ALL FACTURAS
router.get('/getAllFacturas', async (req, res) => {
    try {
        let facturasDB = await Facturas.find();
        if (!facturasDB) {
            res.status(500).json({
                ok: false,
                message: 'Error SErver'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            facturasDB
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        });
        console.log('Error Trying to get all facturas', e);
    }
});

module.exports = router;