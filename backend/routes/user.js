var express = require('express');
var User = require('../services/user');
var router = express.Router();

router.post('/createUser', function (req, res, next) {
    const userService = new User();
    const { userId, orgName } = req.body;
    res.sendPromise(userService.createUser(userId, orgName));
});

router.get('/viewUser/:orgName/:userId', function (req, res, next) {
    const userService = new User();
    const { userId, orgName } = req.params;
    res.sendPromise(userService.viewUser(userId, orgName));
});

router.get('/viewToken/:orgName/:tokenId', function (req, res, next) {
    const userService = new User();
    const { tokenId, orgName } = req.params;
    res.sendPromise(userService.viewToken(tokenId, orgName));
});

router.post('/transferToken', function (req, res, next) {
    const userService = new User();
    const { tokenDetails, orgName } = req.body;
    res.sendPromise(userService.tranferToken(tokenDetails, orgName));
});

router.post('/exchangeTokens', function (req, res, next) {
    const userService = new User();
    res.sendPromise(userService.exchangeTokens());
});

module.exports = router;
