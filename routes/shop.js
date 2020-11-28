const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.get('/', shopController.products);
router.get('/:id', shopController);

module.exports = router;