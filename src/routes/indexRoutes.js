const express = require('express');
const router = express.Router();

router.use(require('./productos'));
router.use(require('./inventario'));
router.use(require('./ventas'));

module.exports = router;