var express = require('express');
var router = express.Router();

router.post('/tokenValidation', function (req, res, next) {
    const validatorService = new Validator();
    res.send(validatorService.tokenValidation());
});

module.exports = router;
