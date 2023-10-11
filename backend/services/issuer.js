const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin
} = require('../application-files/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../application-files/javascript/AppUtil.js');
const winston = require('../utils/logger.js');
const { json } = require('body-parser');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = __dirname;
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

module.exports = class Issuer {
    async createToken(tokenDetails,orgName) {
        const ccp = require('../application-files/javascript/AppUtil.js')[`buildCCP${orgName}`]()

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.'+ orgName.toLowerCase() +'.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, path.join(walletPath,'../','wallets' ,orgName));

        // in a real application this would be done on an administrative flow, and only once
        // await enrollAdmin(caClient, wallet, mspOrg1);

        // // in a real application this would be done only when a new user was required to be added
        // // and would be part of an administrative flow
        // await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();
        var result;
        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, {
                wallet,
                identity: tokenDetails.IssuerAddress,
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
            // This type of transaction would only be run once by an application the first time it was started after it
            // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
            // an "init" type function.
            winston.debug(
                '\n--> Submit Transaction: CreateToken, function creates the token on the ledger'
            );

            result = await contract.submitTransaction(
                'CreateToken',
                tokenDetails.ISIN,
                tokenDetails.ExpiryTime,
                tokenDetails.SecurityType,
                tokenDetails.SecurityName,
                tokenDetails.IssuerAddress,
                tokenDetails.CreatedTime,
                tokenDetails.UpdatedTime,
                tokenDetails.Status,
                tokenDetails.OwnerAddress,
                tokenDetails.FaceValue
            );
            winston.debug('*** Result: committed');
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }

        return result.toString();
    }

    async issueToken(tokenDetails,orgName) {
        const ccp = require('../application-files/javascript/AppUtil.js')[`buildCCP${orgName}`]()

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.'+ orgName.toLowerCase() +'.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, path.join(walletPath,'../','wallets' ,orgName));

        // // in a real application this would be done on an administrative flow, and only once
        // await enrollAdmin(caClient, wallet, mspOrg1);

        // // in a real application this would be done only when a new user was required to be added
        // // and would be part of an administrative flow
        // await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();
        var result;

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, {
                wallet,
                identity: "admin",
                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
            // This type of transaction would only be run once by an application the first time it was started after it
            // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
            // an "init" type function.
            winston.debug(
                '\n--> Submit Transaction: IssueToken, function issues token on the ledger'
            );
                result = 
            await contract.submitTransaction(
                'IssueToken',
                tokenDetails.TokenId,
                tokenDetails.ReceiverAddress
            );
            winston.debug('*** Result: committed');
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }

        return result.toString();
    }
};
