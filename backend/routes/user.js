var express = require('express');
var User = require('../services/user');
var router = express.Router();

router.post('/createUser', function (req, res, next) {
    const userService = new User();
    const { userId,orgName } = req.body;
    res.send(userService.createUser(userId,orgName));
});

router.get('/viewUser/:orgName/:userId', function (req, res, next) {
    const userService = new User();
    const { userId,orgName } = req.params;
    res.send(userService.viewUser(userId,orgName));
});

router.get('/viewToken/:orgName/:tokenId', function (req, res, next) {
    const userService = new User();
    const { tokenId,orgName } = req.params;
    res.send(userService.viewToken(tokenId,orgName));
});

router.post('/transferToken', function (req, res, next) {
    const userService = new User();
    const {tokenDetails,orgName} = req.body;
    res.send(userService.tranferToken(tokenDetails,orgName));
});

router.post('/exchangeTokens', function (req, res, next) {
    const userService = new User();
    res.send(userService.exchangeTokens());
});

module.exports = router;
