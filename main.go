package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	dkgHandler "github.com/kelcheone/ceremonia/routes/dkg"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/run-dkg", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{}
		handler.RunDKGHandler(w, r)
	}).Methods("POST")

	r.HandleFunc("/api/get-file/{sessionId}", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{}
		handler.ServeGeneratedFiles(w, r)
	}).Methods("GET")

	// health check
	r.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	port := ":8090"
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})

	gHandler := c.Handler(r)

	log.Printf("Running server on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, gHandler))
}
