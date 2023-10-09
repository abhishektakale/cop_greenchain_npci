var express = require('express');
var Issuer = require('../services/issuer');
// var token = require('../schemas/token');
var router = express.Router();

router.post('/createToken', function (req, res, next) {
    const issuerService = new Issuer();
    const {tokenDetails,orgName} = req.body;
    res.send(issuerService.createToken(tokenDetails,orgName));
});

router.post('/issueToken', function (req, res, next) {
    const issuerService = new Issuer();
    const {tokenDetails,orgName} = req.body;

    res.send(issuerService.issueToken(tokenDetails,orgName));
});

module.exports = router;
