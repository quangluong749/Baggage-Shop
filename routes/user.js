const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/signIn', userController.signIn);
router.get('/signUp', userController.signUp);

module.exports = router;