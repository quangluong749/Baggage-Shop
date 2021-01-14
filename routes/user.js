const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require("../controllers/homeController");
const passport = require('../passport/index');

router.get('/signin', userController.signIn);

// Register --
router.get('/signup', userController.signUp);
router.post('/add-user', userController.addUser);

// -- Register 

router.get('/contact', userController.contact);
router.get('/', homeController.index);
router.post('/auth', passport.authenticate('local', { 
    successRedirect: '/shop',
    failureRedirect: '/signin',
    failureFlash: false }));
router.get('/logout', userController.logOut);
router.get('/setting', userController.setting);
router.get('/add-product/:id', userController.addProduct);
router.get('/collection', userController.collection);
router.post('/update-profile', userController.updateProfile);

module.exports = router;