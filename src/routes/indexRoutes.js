const express = require('express');
const router = express.Router();

router.use(require('./productos'));
router.use(require('./inventario'));

module.exports = router;