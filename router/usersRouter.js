const router = require('express').Router();
const { usersController } = require('../controller');
const { auth, authRefresh } = require('../helper/authToken');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.patch('/verify', authRefresh, usersController.verification);
router.post('/persistent', authRefresh, usersController.persistenLogin);
router.post('/refresh', authRefresh, usersController.refreshToken);
router.get('/:idusers', usersController.getUserById);

module.exports = router;
