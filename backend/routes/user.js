var express = require('express');
var router = express.Router();

router.post('/transfer', function (req, res, next) {
    const userService = new User();
    const tokenDetails = req.body;   
    const isValid = CreatedToken.res.send(userService.tranferToken(tokenDetails));
});

router.post('/exchange', function (req, res, next) {
    const userService = new User();
    res.send(userService.exchangeTokens());
});


module.exports = router;
