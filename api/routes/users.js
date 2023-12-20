const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');
 

router.post('/signup',UsersController.user_signup);

router.delete('/:userId',checkAuth,UsersController.user_delete);

router.post('/login',UsersController.user_login);

module.exports = router;