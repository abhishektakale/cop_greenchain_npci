var express = require('express');
var router = express.Router();

router.post('/createUser', function (req, res, next) {
    const userService = new User();
    const { userId } = req.body;
    res.send(userService.createUser(userId));
});

router.get('/viewUser/:userId', function (req, res, next) {
    const userService = new User();
    const { userId } = req.params;
    res.send(userService.viewUser(userId));
});

router.get('/viewToken/:tokenId', function (req, res, next) {
    const userService = new User();
    const { tokenId } = req.params;
    res.send(userService.viewToken(tokenId));
});

router.post('/transferToken', function (req, res, next) {
    const userService = new User();
    const tokenDetails = req.body;
    res.send(userService.tranferToken(tokenDetails));
});

router.post('/exchangeTokens', function (req, res, next) {
    const userService = new User();
    res.send(userService.exchangeTokens());
});

module.exports = router;
