package dkgHandler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/kelcheone/ceremonia/utils"
)

type OperatorInfo struct {
	ID     int    `json:"id"`
	PubKey string `json:"public_key"`
	IP     string `json:"ip"`
}

type RunDKGRequest struct {
	Validators    int            `json:"validators"`
	OperatorIds   []int          `json:"operatorIds"`
	OperatorsInfo []OperatorInfo `json:"operatorsInfo"`
	OwnerAddr     string         `json:"ownerAddr"`
	Nonce         int            `json:"nonce"`
	WithdrawAddr  string         `json:"withdrawAddr"`
	Network       string         `json:"network"`
	Expiry        int            `json:"expiry"`
}

type Response struct {
	Message string `json:"message"`
}

type DKGHandler struct {
	Req         RunDKGRequest
	SessionID   string
	OutputDir   string
	CommandArgs string
}

func (d *DKGHandler) RunDKGHandler(w http.ResponseWriter, r *http.Request) {
	err := json.NewDecoder(r.Body).Decode(&d.Req)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid Request Body: %s", err), http.StatusBadRequest)
		return
	}

	d.SessionID = uuid.New().String()

	d.OutputDir = filepath.Join("output", d.SessionID)
	if err := utils.Mkdir(d.OutputDir); err != nil {
		http.Error(w, "Could not create outputDir directory", http.StatusInternalServerError)
		return
	}

	if err := utils.Mkdir("initiator_logs"); err != nil {
		http.Error(w, "Could not create outputDir directory", http.StatusInternalServerError)
		return
	}

	err = d.constructArgs()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err = d.RunCommand(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, err := d.SaveFiles()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// make sure d.Req.Expiry is not 0 if so make it 15 minutes
	if d.Req.Expiry == 0 || d.Req.Expiry < 0 {
		d.Req.Expiry = 15
	}
	exprires := time.Now().Add(time.Duration(d.Req.Expiry) * time.Minute)

	d.ScheduleFileDeletion(exprires)
	res.Expiration = exprires.Format(time.RFC3339)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(res)
}

func (d *DKGHandler) ServeGeneratedFiles(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sessionID := vars["sessionId"]

	// we are to get return the zip file to the user
	sourceDir := filepath.Join("output", sessionID)
	ceremonyFiles, err := os.ReadDir(sourceDir)
	if err != nil {
		http.Error(w, fmt.Sprintf("directory not found: %s", err), http.StatusNotFound)
		return
	}
	if len(ceremonyFiles) == 0 {
		http.Error(w, "no files found in the directory", http.StatusNotFound)
		return
	}

	// find the zip file
	var ceremonyZip string
	for _, file := range ceremonyFiles {
		if !file.IsDir() {
			if strings.HasSuffix(file.Name(), ".zip") {
				ceremonyZip = filepath.Join(sourceDir, file.Name())
				break
			}
		}
	}

	if ceremonyZip == "" {
		http.Error(w, "no zip file found", http.StatusNoContent)
		return
	}

	timeStamp := utils.GetTimeStamp()

	customFilename := fmt.Sprintf("ceremony-%s.zip", timeStamp)
	w.Header().Set("Content-Disposition", fmt.Sprintf("atachment; filename=\"%s\"", customFilename))

	// using IO Copy
	file, err := os.Open(ceremonyZip)
	if err != nil {
		http.Error(w, fmt.Sprintf("could not open file: %s", err), http.StatusInternalServerError)
		return
	}

	defer file.Close()

	_, err = io.Copy(w, file)
	if err != nil {
		fmt.Printf("Error serving file: %s\n", err)
		return
	}
	// http.ServeFile(w, r, ceremonyZip)
	// fmt.Printf("File %s was successfully downloaded by the client.\n", customFilename)
}

func (d *DKGHandler) ScheduleFileDeletion(spawnTime time.Time) {
	time.AfterFunc(time.Until(spawnTime), func() {
		if err := utils.DeleteFiles(d.SessionID); err != nil {
			fmt.Printf("Error deleting files for session %s: %s\n", d.SessionID, err)
		}
	})
}
