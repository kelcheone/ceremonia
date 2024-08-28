package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	dkgHandler "github.com/kelcheone/ceremonia/routes/dkg"
)

func main() {
	r := mux.NewRouter()

	dkgHandler := dkgHandler.DKGHandler{}
	r.HandleFunc("/api/run-dkg", dkgHandler.RunDKGHandler).Methods("POST")
	r.HandleFunc("/api/get-file/{sessionId}", dkgHandler.ServeGeneratedFiles).Methods("GET")

	port := ":8090"

	log.Printf("Running server on port: %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
