const express = require('express');

const shopController = require('../controllers/shopController');
const router = express.Router();

router.get('/', shopController.products);
router.get('/product/:id', shopController.detail);
router.get('/search', shopController.search);
router.get('/filter', shopController.filter);

module.exports = router;