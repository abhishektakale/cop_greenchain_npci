# GreenChain-NPCI Blockchain README

[Demo](demo/Green%20Chain%20by%20NPCI%20Demo.mp4) | [PPT](demo/Green%20chain.pdf)

This is a Project repository for the Hackathon on behalf of NPCI and will be taken down post completion of the Hackathon. This repository contains angular frontend, nodeJS express backend and scripts and configurations used for setting up the Hyperledger Fabric framework to run a GreenChain-NPCI blockchain dApp. Follow the instructions below to create the network, add organizations, and deploy a chaincode.

## Prerequisites

Before running the commands, ensure you have the following prerequisites installed:

1. [Hyperledger Fabric v2.x](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)
2. [Docker](https://docs.docker.com/get-docker/)
3. [Docker Compose](https://docs.docker.com/compose/install/)
4. [Git](https://git-scm.com/downloads)
5. [NodeJS]()
6. [Angular]()

## Instructions

> Note: Run the project in following sequence:
>
> 1. Blockchain
> 2. Backend
> 3. Frontend

### Step 1: Navigate to the Test Network Directory

```
cd blockchain/greenchain-network
```

### Step 2: Create a Channel

Run the following command to create a channel with CouchDB as the state database and certificate authorities (CA):

```
./network.sh createChannel -s couchdb -ca
```

### Step 3: Add Organization 3 (Org3)

Navigate to the `addOrg3` directory:

```
cd addOrg3/
```

Run the following command to add Org3 to the network using CouchDB and certificate authorities (CA):

```
./addOrg3.sh up -s couchdb -ca
```

### Step 4: Add Organization 4 (Org4)

Navigate to the `addOrg4` directory:

```
cd ../addOrg4/
```

Run the following command to add Org4 to the network using CouchDB and certificate authorities (CA):

```
./addOrg4.sh up -s couchdb -ca
```

### Step 5: Deploy Chaincode

Return to the main network directory:

```
cd ..
```

Deploy the chaincode (Smart Contract) on the network using the following command. Replace the necessary parameters such as chaincode name, chaincode path, language, and endorsing peers' endorsement policy as needed:

```
./network.sh deployCC -ccn basic -ccp ../chaincode -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer','Bank3MSP.peer','Bank4MSP.peer')"
```

Make sure to customize the chaincode name (`-ccn`), chaincode path (`-ccp`), language (`-ccl`), and endorsement policy (`-ccep`) according to your specific requirements.

### Step 6: Run Backend

Navigate to `backend` directory:

```
cd backend
```

Install reqired modules:

```
npm i
```

Enroll the admin user for each org:

```
node enrollAdmin.js
```

Run the backend server:

```
npm run start
```

This will start backend on `localhost:3000`

## Conclusion

You have successfully set up the GreenChain-NPCI blockchain network, added Bank3 and Bank4, and deployed a chaincode. Feel free to explore and modify the network and chaincode as needed for your application. For more information, consult the Hyperledger Fabric documentation for further customization and usage guidelines.
