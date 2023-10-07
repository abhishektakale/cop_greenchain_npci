var express = require('express');
var router = express.Router();

router.post('/createToken', function (req, res, next) {
    const issuerService = new Issuer();
    const tokenDetails = req.body;
    const isValid = CreatedToken.
    res.send(issuerService.issueToken(tokenDetails));
});

router.post('/issueToken', function (req, res, next) {
    const issuerService = new Issuer();
    res.send(issuerService.createToken);
});

// router.post('/issueToken', function (req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
