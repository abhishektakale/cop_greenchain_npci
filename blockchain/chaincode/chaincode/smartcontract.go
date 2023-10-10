package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically
type Asset struct {
	AppraisedValue int    `json:"AppraisedValue"`
	Color          string `json:"Color"`
	ID             string `json:"ID"`
	Owner          string `json:"Owner"`
	Size           int    `json:"Size"`
}

type Token struct {
	TokenId          string
	Isin             string
	Expiry           int
	SecurityType     string
	SecurityName     string
	IssuerAddress    string
	CreateTimestamp  int
	UpdatedTimestamp int
	Status           string
	OwnerAddress     string
	FaceValue        int
}

type BondType int

const (
	GREEN  BondType = 0
	CARBON          = 1
)

const GOI_MSP = "GOIMSP"
const NPCI_MSP = "NPCIMSP"
const SBI_MSP = "SBIMSP"
const HDFC_MSP = "HDFCMSP"

type UserWallet struct {
	Bonds         BondType
	WalletBalance int
	OrgName       string
	UserName      string
}

// InitLedger adds a base set of assets to the ledger
// func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
// 	assets := []Asset{
// 		{ID: "asset1", Color: "blue", Size: 5, Owner: "Tomoko", AppraisedValue: 300},
// 		{ID: "asset2", Color: "red", Size: 5, Owner: "Brad", AppraisedValue: 400},
// 		{ID: "asset3", Color: "green", Size: 10, Owner: "Jin Soo", AppraisedValue: 500},
// 		{ID: "asset4", Color: "yellow", Size: 10, Owner: "Max", AppraisedValue: 600},
// 		{ID: "asset5", Color: "black", Size: 15, Owner: "Adriana", AppraisedValue: 700},
// 		{ID: "asset6", Color: "white", Size: 15, Owner: "Michel", AppraisedValue: 800},
// 	}

// 	for _, asset := range assets {
// 		assetJSON, err := json.Marshal(asset)
// 		if err != nil {
// 			return err
// 		}

// 		err = ctx.GetStub().PutState(asset.ID, assetJSON)
// 		if err != nil {
// 			return fmt.Errorf("failed to put to world state. %v", err)
// 		}
// 	}

// 	return nil
// }

func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, userID string) error {

	exists, err := s.ValidateUser(ctx, userID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the user %s already exists", userID)
	}

	mspID, _ := ctx.GetClientIdentity().GetMSPID()

	if mspID == "Org1MSP" {
		mspID = GOI_MSP
	} else if mspID == "Org2MSP" {
		mspID = NPCI_MSP
	} else if mspID == "Bank3MSP" {
		mspID = SBI_MSP
	} else if mspID == "Bank4MSP" {
		mspID = HDFC_MSP
	} else {
		return fmt.Errorf("invalid Org...")
	}

	asset := UserWallet{
		Bonds:         0, //Green Bonds
		WalletBalance: 0,
		OrgName:       mspID,
		UserName:      userID,
	}

	// fmt.Println("User ID : ", asset)

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	// fmt.Println("Marshal : ", assetJSON)
	// fmt.Println("JSON : ", string(assetJSON))

	return ctx.GetStub().PutState(userID, assetJSON)
}

// func HashData(
// 	receivedData interface{},
// ) ([]byte, error) {

// 	// verify private data hash
// 	receivedDataStr, err := json.Marshal(receivedData)
// 	if err != nil {
// 		return nil, fmt.Errorf("error while marshalling received Data, %w", err)
// 	}

// 	receivedDataHash := sha256.Sum256(receivedDataStr)

// 	return receivedDataHash[:], nil
// }

// CreateAsset issues a new asset to the world state with given details.
func (s *SmartContract) CreateToken(ctx contractapi.TransactionContextInterface, isin string, expiry int, securityType string, securityName string, issuerAddress string, createTimestamp int, updatedTimestamp int, status string, ownerAddress string, faceValue int) (string, error) {

	// Check transaction proposal is received from Govt. Of India Org
	if mspID, _ := ctx.GetClientIdentity().GetMSPID(); mspID != "Org1MSP" {
		return "Token can only be created by Govt. Of India Org.", fmt.Errorf("Unauthorized Call! Token can only be created by Govt. Of India Org.")
	}

	// tokenId = string(tokenId)
	exists, err := s.ValidateToken(ctx, isin)
	if err != nil {
		return "", err
	}
	if exists {
		return "", fmt.Errorf("the token %s already exists", isin)
	}

	asset := Token{
		TokenId:          isin,
		Isin:             isin,
		Expiry:           expiry,
		SecurityType:     securityType,
		SecurityName:     securityName,
		IssuerAddress:    issuerAddress,
		CreateTimestamp:  createTimestamp,
		UpdatedTimestamp: updatedTimestamp,
		Status:           status,
		OwnerAddress:     ownerAddress,
		FaceValue:        faceValue,
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return "", err
	}

	issuerJson, err := ctx.GetStub().GetState(issuerAddress)
	if err != nil {
		return "", nil
	}

	var issuer UserWallet
	err = json.Unmarshal(issuerJson, &issuer)
	if err != nil {
		return "", err
	}

	issuer.WalletBalance = issuer.WalletBalance + 1

	issuerJson, err = json.Marshal(issuer)
	if err != nil {
		return "", err
	}

	ctx.GetStub().PutState(issuerAddress, issuerJson)

	return string(isin), ctx.GetStub().PutState(isin, assetJSON)
}

func (s *SmartContract) IssueToken(ctx contractapi.TransactionContextInterface, tokenId string, ownerAddress string) error {

	// Check transaction proposal is received from Govt. Of India Org
	if mspID, _ := ctx.GetClientIdentity().GetMSPID(); mspID != "Org1MSP" {
		return fmt.Errorf("Unauthorized Call! Token can only be created by Govt. Of India Org.")
	}

	ownerJson, err := ctx.GetStub().GetState(ownerAddress)
	if err != nil {
		return nil
	}

	var owner UserWallet
	err = json.Unmarshal(ownerJson, &owner)
	if err != nil {
		return err
	}

	// Check transaction token is not issued to NPCI Org or GOI Org
	if NPCI_MSP == owner.OrgName || GOI_MSP == owner.OrgName {
		return fmt.Errorf("Unauthorized Call! Token cannot be issued to NPCI Org or GOI Org.")
	}

	assetJSON, err := ctx.GetStub().GetState(tokenId)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return fmt.Errorf("the token %s does not exist", tokenId)
	}

	var asset Token
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return err
	}

	asset.OwnerAddress = ownerAddress

	assetJSON, err = json.Marshal(asset)
	if err != nil {
		return err
	}

	// ownerJson, err := ctx.GetStub().GetState(ownerAddress)
	// if err != nil {
	// 	return nil
	// }

	// var owner UserWallet
	// err = json.Unmarshal(ownerJson, &owner)
	// if err != nil {
	// 	return err
	// }

	owner.WalletBalance = owner.WalletBalance + 1

	ownerJson, err = json.Marshal(owner)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState(ownerAddress, ownerJson)

	issuerJson, err := ctx.GetStub().GetState(asset.IssuerAddress)
	if err != nil {
		return err
	}

	var issuer UserWallet
	err = json.Unmarshal(issuerJson, &issuer)
	if err != nil {
		return err
	}

	issuer.WalletBalance = issuer.WalletBalance - 1

	issuerJson, err = json.Marshal(issuer)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState(asset.IssuerAddress, issuerJson)

	return ctx.GetStub().PutState(tokenId, assetJSON)
}

func (s *SmartContract) TransferToken(ctx contractapi.TransactionContextInterface, tokenId string, receiverAddress string, bondmarketValue int) error {

	// Check transaction proposal is received from Govt. Of India Org
	if mspID, _ := ctx.GetClientIdentity().GetMSPID(); mspID == "Org2MSP" || mspID == "Org1MSP" {
		return fmt.Errorf("Unauthorized Call! Token cannot be transfered from Givt. of India Org or NPCI Org.")
	}

	newOwnerJson, err := ctx.GetStub().GetState(receiverAddress)
	if err != nil {
		return err
	}

	var newOwner UserWallet
	err = json.Unmarshal(newOwnerJson, &newOwner)
	if err != nil {
		return err
	}

	// Check transaction token is not transfered to NPCI Org or GOI Org
	if NPCI_MSP == newOwner.OrgName || GOI_MSP == newOwner.OrgName {
		return fmt.Errorf("Unauthorized Call! Token cannot be transfered to NPCI Org or GOI Org.")
	}

	exists, err := s.ValidateUser(ctx, receiverAddress)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the user does %s already exists", receiverAddress)
	}

	assetJSON, err := ctx.GetStub().GetState(tokenId)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return fmt.Errorf("the token %s does not exist", tokenId)
	}

	var asset Token
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return err
	}

	prevOwnerJson, err := ctx.GetStub().GetState(asset.OwnerAddress)
	if err != nil {
		return nil
	}

	var prevOwner UserWallet
	err = json.Unmarshal(prevOwnerJson, &prevOwner)
	if err != nil {
		return err
	}

	prevOwner.WalletBalance = prevOwner.WalletBalance - 1

	prevOwnerJson, err = json.Marshal(prevOwner)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState(asset.OwnerAddress, prevOwnerJson)

	asset.OwnerAddress = receiverAddress

	assetJSON, err = json.Marshal(asset)
	if err != nil {
		return err
	}

	newOwner.WalletBalance = newOwner.WalletBalance + 1

	newOwnerJson, err = json.Marshal(newOwner)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState(receiverAddress, newOwnerJson)

	return ctx.GetStub().PutState(tokenId, assetJSON)
}

// CreateAsset issues a new asset to the world state with given details.
// func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if exists {
// 		return fmt.Errorf("the asset %s already exists", id)
// 	}

// 	asset := Asset{
// 		ID:             id,
// 		Color:          color,
// 		Size:           size,
// 		Owner:          owner,
// 		AppraisedValue: appraisedValue,
// 	}
// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, assetJSON)
// }

// ReadAsset returns the asset stored in the world state with given id.
// func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
// 	assetJSON, err := ctx.GetStub().GetState(id)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to read from world state: %v", err)
// 	}
// 	if assetJSON == nil {
// 		return nil, fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	var asset Asset
// 	err = json.Unmarshal(assetJSON, &asset)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return &asset, nil
// }

// UpdateAsset updates an existing asset in the world state with provided parameters.
// func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string, color string, size int, owner string, appraisedValue int) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	// overwriting original asset with new asset
// 	asset := Asset{
// 		ID:             id,
// 		Color:          color,
// 		Size:           size,
// 		Owner:          owner,
// 		AppraisedValue: appraisedValue,
// 	}
// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return err
// 	}

// 	return ctx.GetStub().PutState(id, assetJSON)
// }

// // DeleteAsset deletes an given asset from the world state.
// func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
// 	exists, err := s.AssetExists(ctx, id)
// 	if err != nil {
// 		return err
// 	}
// 	if !exists {
// 		return fmt.Errorf("the asset %s does not exist", id)
// 	}

// 	return ctx.GetStub().DelState(id)
// }

// AssetExists returns true when asset with given ID exists in world state
func (s *SmartContract) ValidateToken(ctx contractapi.TransactionContextInterface, tokenId string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(tokenId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

func (s *SmartContract) ValidateUser(ctx contractapi.TransactionContextInterface, userId string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(userId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

func (s *SmartContract) ViewToken(ctx contractapi.TransactionContextInterface, tokenId string) (Token, error) {
	var asset Token
	assetJSON, err := ctx.GetStub().GetState(tokenId)
	if err != nil {
		return asset, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return asset, fmt.Errorf("Token %s does not exists", tokenId)
	}

	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return asset, err
	}

	return asset, nil
}

func (s *SmartContract) GetAllTokens(ctx contractapi.TransactionContextInterface, ownerAddress string) ([]*Token, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*Token
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Token
		err = json.Unmarshal(queryResponse.Value, &asset)
		if asset.OwnerAddress == ownerAddress {
			assets = append(assets, &asset)
		}
	}

	return assets, nil
}

func (s *SmartContract) ViewUser(ctx contractapi.TransactionContextInterface, userId string) (UserWallet, error) {

	var asset UserWallet
	assetJSON, err := ctx.GetStub().GetState(userId)
	if err != nil {
		return asset, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return asset, fmt.Errorf("User %s does not exists", userId)
	}

	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return asset, err
	}

	return asset, nil
}

func (s *SmartContract) GetAllUsers(ctx contractapi.TransactionContextInterface) ([]*UserWallet, error) {

	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*UserWallet
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset UserWallet
		err = json.Unmarshal(queryResponse.Value, &asset)
		if asset.OrgName != "" {
			assets = append(assets, &asset)
		}
	}

	return assets, nil
}

// TransferAsset updates the owner field of asset with given id in world state, and returns the old owner.
// func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) (string, error) {
// 	asset, err := s.ReadAsset(ctx, id)
// 	if err != nil {
// 		return "", err
// 	}

// 	oldOwner := asset.Owner
// 	asset.Owner = newOwner

// 	assetJSON, err := json.Marshal(asset)
// 	if err != nil {
// 		return "", err
// 	}

// 	err = ctx.GetStub().PutState(id, assetJSON)
// 	if err != nil {
// 		return "", err
// 	}

// 	return oldOwner, nil
// }

// GetAllAssets returns all assets found in world state
// func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
// 	// range query with empty string for startKey and endKey does an
// 	// open-ended query of all assets in the chaincode namespace.
// 	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer resultsIterator.Close()

// 	var assets []*Asset
// 	for resultsIterator.HasNext() {
// 		queryResponse, err := resultsIterator.Next()
// 		if err != nil {
// 			return nil, err
// 		}

// 		var asset Asset
// 		err = json.Unmarshal(queryResponse.Value, &asset)
// 		if err != nil {
// 			return nil, err
// 		}
// 		assets = append(assets, &asset)
// 	}

// 	return assets, nil
// }
