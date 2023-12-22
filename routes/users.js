var express = require('express');
var router = express.Router();
const UserService = require('../services/userService');

router.post('/register',UserService.registerUser);
router.post('/login',UserService.login);

module.exports = router;