package main

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	e2m_core "github.com/bloxapp/eth2-key-manager/core"
	"github.com/bloxapp/ssv-dkg/pkgs/crypto"
	"github.com/bloxapp/ssv-dkg/pkgs/initiator"
	"github.com/ethereum/go-ethereum/common"
	"github.com/imroc/req/v3"
	"github.com/sourcegraph/conc/pool"
	"github.com/wailsapp/wails/cmd"
	"go.uber.org/zap"

	"github.com/kelcheone/ceremonia/pkgs/wire"
)

const (
	maxConcurrency = 20
)

func GetOperators() (*wire.OperatorsCLI, []uint64, error) {
	operatorsFile := "operators-local.json"
	var operators wire.OperatorsCLI
	data, err := os.ReadFile(operatorsFile)
	if err != nil {
		return nil, nil, err
	}

	if err = json.Unmarshal(data, &operators); err != nil {
		return nil, nil, err
	}

	var operatorsIDs []uint64

	for _, o := range operators {
		operatorsIDs = append(operatorsIDs, o.ID)
	}
	return &operators, operatorsIDs, err
}

func GeneratePrivateKey() *rsa.PrivateKey {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatalln(err)
	}
	return priv
}

func RawInitiator() {
	logger := zap.NewExample().Sugar()
	operatorsInfo, opertorsId, err := GetOperators()
	if err != nil {
		log.Fatalln(err)
	}

	validators := 2

	ctx := context.Background()

	// convert operators to operatorsCLI compatitble with initiator.Operators
	operators := make(initiator.Operators, len(*operatorsInfo))
	for i, o := range *operatorsInfo {
		operators[opertorsId[i]] = initiator.Operator{
			Addr:   o.Addr,
			ID:     o.ID,
			PubKey: o.PubKey,
		}
	}
	ethnetwork := e2m_core.NetworkFromString("holesky")

	strWithrawalAddr := "0xa1a66cc5d309f19fb2fda2b7601b223053d0f7f4"
	strOwnerAddr := "0xb64923DA2c1A9907AdC63617d882D824033a091c"

	WithrawalAddr := common.HexToAddress(strWithrawalAddr)
	ownerAddr := common.HexToAddress(strOwnerAddr)

	pool := pool.NewWithResults[*Result]().WithContext(ctx).WithFirstError().WithMaxGoroutines(maxConcurrency)
	for i := 0; i < int(validators); i++ {
		i := i
		pool.Go(func(ctx context.Context) (*Result, error) {
			// Create new DKG initiator
			// dkgInitiator := initiator.New(pKey, operators, logger.Desugar(), cmd.Version)
			dkgInitiator, err := New(operators, logger.Desugar(), cmd.Version, nil)

			id := crypto.NewID()
			nonce := uint64(i)

			depositData, keyShares, proofs, err := dkgInitiator.StartDKG(id, WithrawalAddr.Bytes(), opertorsId, ethnetwork, common.Address(ownerAddr.Bytes()), nonce)
			if err != nil {
				return nil, err
			}

			logger.Debug("DKG ceremony completed",
				zap.String("id", hex.EncodeToString(id[:])),
				zap.Uint64("nonce", nonce),
				zap.String("pubkey", depositData.PubKey),
			)
			return &Result{
				id:          id,
				nonce:       nonce,
				depositData: depositData,
				proof:       proofs,
				keyShares:   keyShares,
			}, nil
		})
	}
	results, err := pool.Wait()
	if err != nil {
		logger.Fatalln(err)
	}
	var depositDataArr []*wire.DepositDataCLI
	var keySharesArr []*initiator.KeyShares
	var proofs []*initiator.CeremonySigs

	for _, res := range results {
		depositDataArr = append(depositDataArr, (*wire.DepositDataCLI)(res.depositData))
		keySharesArr = append(keySharesArr, res.keyShares)
		proofs = append(proofs, res.proof)
	}

	// write results to file
	writeResultsToFile(results)
}

func writeResultsToFile(results []*Result) {
	file, err := os.Create("results.json")
	if err != nil {
		log.Fatalln(err)
	}
	defer file.Close()

	enc := json.NewEncoder(file)

	if err := enc.Encode(results); err != nil {
		log.Fatalln(err)
	}
}

type Result struct {
	id          [24]byte
	nonce       uint64
	depositData *initiator.DepositDataJson
	keyShares   *initiator.KeyShares
	proof       *initiator.CeremonySigs
}

// New creates a main initiator structure
func New(operators initiator.Operators, logger *zap.Logger, ver string, certs []string) (*initiator.Initiator, error) {
	client := req.C()
	// set CA certificates if any
	if len(certs) > 0 {
		client.SetRootCertsFromFile(certs...)
	} else {
		client.SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	}
	// Set timeout for operator responses
	client.SetTimeout(30 * time.Second)
	privKey, _, err := crypto.GenerateKeys()
	if err != nil {
		return nil, fmt.Errorf("failed to generate RSA keys: %s", err)
	}
	c := &initiator.Initiator{
		Logger:     logger,
		Client:     client,
		Operators:  operators,
		PrivateKey: privKey,
		Version:    []byte(ver),
		VerifyFunc: initiator.CreateVerifyFunc(operators),
	}
	return c, nil
}
