const express = require('express');
router = express.Router();

// TO VIEW THE FIRTS PAGE
router.get('/ventas', (req, res) => {
    res.render('ventas');
});

module.exports = router;