package dkgHandler

import (
	"bufio"
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
		Message    string   `json:"message"`
	}
)
type LogMessage struct {
	Level       string                 `json:"L"`
	Timestamp   string                 `json:"T"`
	Name        string                 `json:"N,omitempty"`
	Message     string                 `json:"M"`
	InitID      string                 `json:"init ID,omitempty"`
	Operator    int                    `json:"operator,omitempty"`
	Method      string                 `json:"method,omitempty"`
	Error       string                 `json:"error,omitempty"`
	LevelDetail string                 `json:"level,omitempty"`
	Encoder     string                 `json:"encoder,omitempty"`
	Format      string                 `json:"format,omitempty"`
	FileOptions map[string]interface{} `json:"file_options,omitempty"`
	Version     string                 `json:"Version,omitempty"`
	PublicKey   string                 `json:"initiator public key,omitempty"`
	OperatorIDs []int                  `json:"operator IDs,omitempty"`
}

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
	)
	return nil
}

func (d DKGHandler) RunCommand() error {
	var base string
	if d.Env == "local" {
		base = "./ssv-dkg init"
	} else {
		base = "ssv-dkg init"
	}

	command := fmt.Sprintf("%s %s", base, d.CommandArgs)
	fmt.Println(command)
	cmd := exec.Command("sh", "-c", command)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()
	if err != nil {
		return fmt.Errorf("could not run command: %s", err)
	}
	return nil
}

func (d *DKGHandler) CheckLogs() (string, error) {
	logFilePath := filepath.Join("initiator_logs", fmt.Sprintf("%s.log", d.SessionID))
	logFile, err := os.Open(logFilePath)
	if err != nil {
		return "", fmt.Errorf("could not open log file")
	}

	defer logFile.Close()

	scanner := bufio.NewScanner(logFile)
	// get the last line of the log file
	var lastLine string
	for scanner.Scan() {
		lastLine = scanner.Text()
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("could not read log file")
	}

	var logMessage LogMessage
	err = json.Unmarshal([]byte(lastLine), &logMessage)

	if err != nil {
		return "", fmt.Errorf("could not unmarshal log message")
	}

	if logMessage.Error != "" {
		return "", fmt.Errorf(logMessage.Error)
	}
	return logMessage.Message, nil
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

	ceremonyDirPath := filepath.Join(ceremonyDir)

	// zip the files in ceremonyDir
	ceremonyZip := filepath.Join(outputDir, "ceremony.zip")
	if err := utils.ZipDirectory(ceremonyDirPath, ceremonyZip); err != nil {
		return nil, fmt.Errorf("could not zip the ceremony files: %s", err)
	}

	res := &RunDKGResponse{
		SessionID: d.SessionID,
		File: FileInfo{
			Name: finalName,
			URL:  ceremonyZip,
		},
	}

	return res, nil
}
