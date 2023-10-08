var express = require('express');
var Issuer = require('../services/issuer');
// var token = require('../schemas/token');
var router = express.Router();

router.post('/createToken', function (req, res, next) {
    const issuerService = new Issuer();
    const tokenDetails = req.body;
    res.send(issuerService.createToken(tokenDetails));
});

router.post('/issueToken', function (req, res, next) {
    const issuerService = new Issuer();
    const tokenDetails = req.body;

    res.send(issuerService.issueToken(tokenDetails));
});

module.exports = router;
