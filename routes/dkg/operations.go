package dkgHandler

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/kelcheone/ceremonia/utils"
)

type (
	FileInfo struct {
		Name string `json:"name"`
		URL  string `json:"url"`
	}
	RunDKGResponse struct {
		File       FileInfo `json:"file"`
		SessionID  string   `json:"sessionId"`
		Expiration string   `json:"expiration"`
	}
)

func (d *DKGHandler) constructArgs() error {
	configDir := filepath.Join("config", d.SessionID)
	if err := utils.Mkdir(configDir); err != nil {
		return fmt.Errorf("could not create config directory")
	}
	operatorsPath, err := writeToFile(configDir, d.Req.OperatorsInfo)
	if err != nil {
		return err
	}
	operatorIdsStr := make([]string, len(d.Req.OperatorIds))
	for i, id := range d.Req.OperatorIds {
		operatorIdsStr[i] = fmt.Sprintf("%d", id)
	}
	d.CommandArgs = fmt.Sprintf(
		"--validators %d --operatorIDs %s --operatorsInfoPath %s --owner %s --nonce %d --withdrawAddress %s --network %s --outputPath %s --logLevel info --logFormat json --logLevelFormat capitalColor --logFilePath ./initiator_logs/debug.log",
		d.Req.Validators, strings.Join(operatorIdsStr, ","), operatorsPath, d.Req.OwnerAddr, d.Req.Nonce, d.Req.WithdrawAddr, d.Req.Network, d.OutputDir,
	)
	return nil
}

func (d DKGHandler) runCommand() error {
	base := "ssv-dkg init"
	command := fmt.Sprintf("%s %s", base, d.CommandArgs)
	fmt.Println(command)
	cmd := exec.Command("sh", "-c", command)
	fmt.Println("--------we are here -----------")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("could not run command: %s", err)
	}
	return nil
}

func writeToFile(dir string, data []OperatorInfo) (string, error) {
	operatorsInfoPath := filepath.Join(dir, "operators.json")
	operatorsInfoFile, err := os.Create(operatorsInfoPath)
	if err != nil {
		return "", fmt.Errorf("could not create operators info file")
	}
	defer operatorsInfoFile.Close()

	operatorsInfoData, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("could not marshal operators info")
	}

	if _, err := operatorsInfoFile.Write(operatorsInfoData); err != nil {
		return "", fmt.Errorf("could not write operators info to file")
	}

	return operatorsInfoPath, nil
}

func (d *DKGHandler) SaveFiles() (*RunDKGResponse, error) {
	outputDir := filepath.Join("output", d.SessionID)

	ceremonyFiles, err := os.ReadDir(outputDir)
	if err != nil {
		return nil, fmt.Errorf("could not read output directory: %s", err)
	}
	if len(ceremonyFiles) == 0 {
		return nil, fmt.Errorf("no files found in the output directory")
	}

	// make sure the file is a directory not a file
	var ceremonyDir string
	var finalName string

	for _, file := range ceremonyFiles {
		if file.IsDir() {
			// check if the directory starts with "ceremony-"
			if strings.HasPrefix(file.Name(), "ceremony-") {
				finalName = file.Name() + ".zip"
				ceremonyDir = filepath.Join(outputDir, file.Name())
				break
			}
		}
	}

	if ceremonyDir == "" {
		return nil, fmt.Errorf("no ceremony directory found")
	}

	ceremonyDirPath, err := filepath.Abs(ceremonyDir)
	if err != nil {
		return nil, fmt.Errorf("could not get the absolute path of the ceremony directory: %s", err)
	}

	// zip the files in ceremonyDir
	ceremonyZip := filepath.Join(outputDir, "ceremony.zip")
	if err := utils.ZipDirectory(ceremonyDirPath, ceremonyZip); err != nil {
		return nil, fmt.Errorf("could not zip the ceremony files: %s", err)
	}

	// get the absolute path of the ceremony zip -> /home...
	ceremonyZipAbsPath, err := filepath.Abs(ceremonyZip)
	if err != nil {
		return nil, fmt.Errorf("could not get the absolute path of the ceremony zip: %s", err)
	}

	res := &RunDKGResponse{
		SessionID: d.SessionID,
		File: FileInfo{
			Name: finalName,
			URL:  ceremonyZipAbsPath,
		},
	}

	return res, nil
}
