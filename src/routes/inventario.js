const express = require('express');
const router = express.Router();
const Inventario = require('../model/inventario');

// TO DISPLAY THE FIRTS PAGE
router.get('/inventario', async (req, res) => {
    res.render('inventario');
});

//TO SAVE IN INVENTORI
router.post('/inventario', async (req, res) => {
    let {
        productId,
        cantidad
    } = req.body
    try {
        let inventarioDB = await Inventario.findOneAndUpdate({
            productId: productId
        }, {
            cantidad: cantidad
        }, {
            new: true,
            upsert: true
        });
        if (!inventarioDB) {
            res.status(500).json({
                ok: false,
                message: 'Server Error'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            inventarioDB
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        });
        console.log('Error Trying to insert in inventario', e);
    }
});

// TO GET CANTIDAD OF PRODUCTS
router.post('/getCantidad', async (req, res) => {
    let {
        id
    } = req.body
    try {
        let cantidadProduct = await Inventario.findOne({
            productId: id
        });
        if (!cantidadProduct) {
            res.status(500).json({
                ok: false,
                message: 'Server error'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            cantidadProduct
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'error',
            e: e
        });
        console.log('Error tryitng to get cantidad', e);
    }
});

// TO GET ALL INVENTARIO
router.get('/getInventario', async (req, res) => {
    try {
        let inventarioDB = await Inventario.find();
        if (!inventarioDB) {
            res.status(500).json({
                ok: false,
                message: 'Server Error'
            })
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            inventarioDB
        })
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        })
        console.log('Error trying to get all inventory', e);
    }
});

module.exports = router;