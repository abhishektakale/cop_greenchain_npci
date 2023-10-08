var express = require('express');
// var token = require('../schemas/token');
var router = express.Router();

router.post('/createToken', function (req, res, next) {
    const issuerService = new Issuer();
    const tokenDetails = req.body;
    // const isValid = token.CreateTokenSchema.validate(tokenDetails);

    res.send(issuerService.issueToken(tokenDetails));
});

router.post('/issueToken', function (req, res, next) {
    const issuerService = new Issuer();
    const tokenDetails = req.body;

    res.send(issuerService.issueToken(tokenDetails));
});

// router.post('/issueToken', function (req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
