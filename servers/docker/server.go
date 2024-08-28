package dockerServer

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type RunDockerRequest struct {
	Command string `json:"command"`
}

type FileInfo struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type RunDockerResponse struct {
	Files     []FileInfo `json:"files"`
	SessionID string     `json:"sessionId"`
}

type DockerSerVer struct {
	port string
}

func (d *DockerSerVer) Start(port string) {
	d.port = port
	r := mux.NewRouter()

	r.HandleFunc("/api/run-docker", d.runDockerHandler).Methods("POST")
	r.HandleFunc("/api/claeanup/{sessionId}", d.cleanUpHandler).Methods("GET")
	r.PathPrefix("/output/").Handler(
		http.StripPrefix(
			"/output/",
			http.FileServer(http.Dir("output")),
		))

	log.Printf("Server running on port %s", d.port)
	log.Fatal(http.ListenAndServe(":"+d.port, r))
}

func sanitizeVolumeName(volumeName string) string {
	// replace all non-alphanumeric characters with _
	return strings.Replace(volumeName, "-", "1", -1)
}

func RemoveHyphen(s string) string {
	return strings.Replace(s, "-", "", -1)
}

func MakeIntoUUID(s string) string {
	return s[:8] + s[9:13] + s[14:18] + s[19:23] + s[24:]
}

func (d DockerSerVer) runDockerHandler(w http.ResponseWriter, r *http.Request) {
	var req RunDockerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid Request Body", http.StatusBadRequest)
		return
	}

	if !strings.HasPrefix(req.Command, "bloxstaking/ssv-dkg") {
		http.Error(w, "invalid command", http.StatusBadRequest)
		return
	}

	uuidString := uuid.New().String()
	// make into a valid volume name
	sessionID := MakeIntoUUID(uuidString)
	// outputDir := filepath.Join("output", sessionID)
	outputDir := fmt.Sprintf("output_%s", sessionID)
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		http.Error(w, "Error creating output directory", http.StatusInternalServerError)
		return
	}

	dockerCommand := fmt.Sprintf("docker run --rm -v %s:/data %s", outputDir, req.Command)
	cmd := exec.Command("sh", "-c", dockerCommand)
	output, err := cmd.CombinedOutput()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error: %s", string(output)), http.StatusInternalServerError)
		return
	}

	files, err := os.ReadDir(outputDir)
	if err != nil {
		http.Error(w, "Error reading output directory", http.StatusInternalServerError)
		return
	}

	var fileInfos []FileInfo

	for _, file := range files {
		fileInfos = append(fileInfos, FileInfo{
			Name: file.Name(),
			URL:  fmt.Sprintf("/output_%s/%s", sessionID, file.Name()),
		})
	}

	response := RunDockerResponse{
		Files:     fileInfos,
		SessionID: sessionID,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (d DockerSerVer) cleanUpHandler(w http.ResponseWriter, r *http.Request) {
}
