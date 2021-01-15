const express = require('express');
const router = express.Router();

const userController = require('../../controllers/api/userController');

router.get('/check-username', userController.checkUsername)

module.exports = router;