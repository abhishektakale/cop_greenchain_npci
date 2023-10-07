var express = require('express');
var router = express.Router();
var issuerRouter = require('./issuer');
var validatorRouter = require('./validator');

router.use('/issuer', issuerRouter);
router.use('/validator', validatorRouter);
module.exports = router;
