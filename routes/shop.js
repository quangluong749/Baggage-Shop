const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const userController = require('../controllers/userController');

router.get('/', shopController.products);
router.get('/:id', shopController.detail);
router.post('/', shopController.search);

module.exports = router;