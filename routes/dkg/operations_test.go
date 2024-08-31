package dkgHandler

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestConstructArgs(t *testing.T) {
	d := &DKGHandler{
		SessionID: "test-session",
		Req: RunDKGRequest{
			Validators:    1,
			OperatorIds:   []int{1, 2, 3},
			OperatorsInfo: []OperatorInfo{{ID: 1, PubKey: "key1"}, {ID: 2, PubKey: "key2"}},
			OwnerAddr:     "0xOwner",
			Nonce:         1,
			WithdrawAddr:  "0xWithdraw",
			Network:       "testnet",
		},
		OutputDir: "output",
	}

	err := d.constructArgs()
	require.NoError(t, err)
	expectedArgs := "--validators 1 --operatorIDs 1,2,3 --operatorsInfoPath config/test-session/operators.json --owner 0xOwner --nonce 1 --withdrawAddress 0xWithdraw --network testnet --outputPath output --logLevel info --logFormat json --logLevelFormat capitalColor --logFilePath ./initiator_logs/debug.log"
	require.Equal(t, expectedArgs, d.CommandArgs)
}

func TestWriteToFile(t *testing.T) {
	dir := t.TempDir()
	data := []OperatorInfo{{ID: 1, PubKey: "key1"}, {ID: 2, PubKey: "key2"}}

	path, err := writeToFile(dir, data)
	require.NoError(t, err)

	fileData, err := os.ReadFile(path)
	require.NoError(t, err)

	var readData []OperatorInfo
	err = json.Unmarshal(fileData, &readData)
	require.NoError(t, err)
	require.Equal(t, data, readData)
}
