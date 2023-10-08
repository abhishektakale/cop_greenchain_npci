var express = require('express');
var router = express.Router();
var issuerRouter = require('./issuer');
var validatorRouter = require('./validator');
var userRouter = require('./user');

router.use('/issuer', issuerRouter);
router.use('/validator', validatorRouter);
router.use('/user', userRouter);
module.exports = router;
