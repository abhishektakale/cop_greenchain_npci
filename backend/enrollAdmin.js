const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin
} = require('./application-files/javascript/CAUtil.js');
const { buildCCPOrg1,buildCCPOrg2,buildCCPBank3,buildCCPBank4, buildWallet } = require('./application-files/javascript/AppUtil.js');
const winston = require('./utils/logger.js');

const walletPath = __dirname;

const enrollAdminOrg1 = async(orgName) => {

    const ccp = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, path.join(walletPath, 'wallets', orgName));

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, orgName + "MSP");

}

const enrollAdminOrg2 = async(orgName) => {

    const ccp = buildCCPOrg2();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, path.join(walletPath,  'wallets', orgName));

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, orgName + "MSP");

}

const enrollAdminBank3 = async(orgName) => {

    const ccp = buildCCPBank3();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.bank3.example.com');
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, path.join(walletPath,  'wallets', orgName));

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, orgName + "MSP");

}

const enrollAdminBank4 = async(orgName) => {

    const ccp = buildCCPBank4();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.bank4.example.com');
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, path.join(walletPath,  'wallets', orgName));

    // in a real application this would be done on an administrative flow, and only once
    await enrollAdmin(caClient, wallet, orgName + "MSP");

}

// module.exports = async ()=>{
    enrollAdminOrg1("Org1")
    enrollAdminOrg2("Org2")
    enrollAdminBank3("Bank3")
    enrollAdminBank4("Bank4")
// }