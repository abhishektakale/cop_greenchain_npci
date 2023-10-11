const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin
} = require('../application-files/javascript/CAUtil.js');
const { buildWallet } = require('../application-files/javascript/AppUtil.js');
const winston = require('../utils/logger.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = __dirname;
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

module.exports = class User {
    async createUser(userId, orgName) {
        const ccp = require('../application-files/javascript/AppUtil.js')[`buildCCP${orgName}`]()

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.'+ orgName.toLowerCase() +'.example.com');

        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets,path.join(walletPath,'../','wallets' ,orgName));

        // in a real application this would be done on an administrative flow, and only once
        // await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, orgName + 'MSP', userId, 'org1.department1');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();
        var result
        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, {
                wallet,
                identity: userId,
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
                '\n--> Submit Transaction: CreateUser, function creates new users on the ledger'
            );
            await contract.submitTransaction('CreateUser', userId);
            winston.debug('*** Result: committed');
        }catch(error){
            return false
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
            // return "User Created Successfully!"
        }
        return true
    }

    async viewUser(userId,orgName) {
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
        var result
        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, {
                wallet,
                identity: userId,
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
                '\n--> Evaluate Transaction: ViewUser, function views users on Ledger'
            );
            result = await contract.evaluateTransaction('ViewUser', userId);
            winston.debug('*** Result: '+ result.toString());
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return result
    }

    async viewAllUsers(){

        var orgName = "Org1"

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
                '\n--> Evaluate Transaction: ViewToken, function views token on the ledger'
            );
            var result = await contract.evaluateTransaction('GetAllUsers');
            winston.debug('*** Result: '+ result.toString());
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return JSON.parse(result.toString());

    }

    async viewToken(tokenId,orgName) {
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
                '\n--> Evaluate Transaction: ViewToken, function views token on the ledger'
            );
            var result = await contract.evaluateTransaction('ViewToken', tokenId);
            winston.debug('*** Result: '+ result.toString());
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    }

    async viewAllTokensForUser(userId){

        var orgName = "Org1"

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
        var result
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
                '\n--> Evaluate Transaction: ViewToken, function views token on the ledger'
            );
            result = await contract.evaluateTransaction('GetAllTokens', userId);
            winston.debug('*** GetAllTokens Result: '+ result.toString());
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return JSON.parse(result.toString());

    }

    async tranferToken(tokenDetails,orgName) {
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
                '\n--> Submit Transaction: TransferToken, function creates transfer of token on the ledger'
            );

            result = await contract.submitTransaction(
                'TransferToken',
                tokenDetails.TokenId,
                tokenDetails.ReceiverAddress,
                tokenDetails.BondmarketValue
            );
            winston.debug('*** Result: committed');
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return result.toString();
    }
    // async exchangeTokens() {}
};
