const express = require('express');
const router = express.Router();
const Productos = require('../model/productos');
const Inventario = require('../model/inventario');

// TO VIEW THE PRINCIPAL PAGE
router.get('/productos', (req, res) => {
    res.render('productos');
});

// TO INSERT IN THE DB NEW PRODUCTS
router.post('/productos', async (req, res) => {
    let {
        nombre,
        descripcion,
        precio
    } = req.body;
    try {
        const product = new Productos();
        product.nombre = nombre;
        product.descripcion = descripcion;
        product.precio = precio;
        product.disponilbe = true;
        product.cantidad = 0;
        let productDB = await product.save();
        if (!product) {
            res.status(500).json({
                ok: false,
                message: 'Erro Server'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'product saved!!',
            productDB,
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        });
        console.log('Error trying to insert in DB');
    }
});

// TO GET ALL PRODUCTS
router.get('/products', async (req, res) => {
    try {
        let productDB = await Productos.find({
            disponilbe: true
        });
        if (!productDB) {
            res.status(500).json({
                ok: false,
                message: 'Error server'
            })
        }
        res.status(200).json({
            ok: true,
            message: 'Success',
            productDB
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Some Error'
        });
        console.log('Error Trying to get all products');
    }
});

// TO DELETE A PRODUCT
router.post('/deleteProducts', async (req, res) => {
    let {
        id
    } = req.body;
    try {
        let productDB = await Productos.findByIdAndUpdate(id, {
            disponilbe: false
        }, {
            new: true
        });
        if (!productDB) {
            res.status(500).json({
                ok: false,
                message: 'Error Server'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            productDB
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error Server'
        });
        console.log('Error trying to delete a products');
    }
});

// TO SET NEW CANTIDAD A PRODUCT
router.post('/newStock', async (req, res) => {
    let {
        productId,
        cantidad
    } = req.body
    try {
        let newStockDB = await Productos.findOneAndUpdate({
            _id: productId
        }, {
            cantidad: cantidad
        }, {
            new: true,
            upsert: true
        });
        if (!newStockDB) {
            res.status(500).json({
                ok: false,
                message: 'Server Error'
            });
        }
        res.status(200).json({
            ok: true,
            message: 'success',
            newStockDB: newStockDB
        });
    } catch (e) {
        res.status(400).json({
            ok: false,
            message: 'Error'
        });
        console.log('Error tratando de meter un newStock', e);
    }
});

module.exports = router;