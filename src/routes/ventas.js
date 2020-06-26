const express = require('express');
router = express.Router();

// TO VIEW THE FIRTS PAGE
router.get('/ventas', (req, res) => {
    res.render('ventas');
});

// TO GET FACTURA
router.post('/factura', async (req, res) => {
    console.log('Fuck');
    console.log(req.body);
    res.json({
        ok: true,
        message: "recived"
    })
});

module.exports = router;