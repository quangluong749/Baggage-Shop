const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require("../controllers/homeController");

router.get('/signIn', userController.signIn);
router.get('/signUp', userController.signUp);
router.get('/contact', userController.contact)
router.get('/home', homeController.index);

module.exports = router;