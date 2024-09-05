package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	dkgHandler "github.com/kelcheone/ceremonia/routes/dkg"
)

var (
	env  = "prod"
	port = "8090"
)

func init() {
	args := os.Args
	if len(args) >= 2 {
		env = args[1]
	} else {
		env = "prod"
	}

	if len(args) >= 3 {
		port = args[2]
	}

	fmt.Println(env)
	fmt.Println(port)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/run-dkg", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env}
		handler.RunDKGHandler(w, r)
	}).Methods("POST")

	r.HandleFunc("/api/get-file/{sessionId}", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env}
		handler.ServeGeneratedFiles(w, r)
	}).Methods("GET")

	r.HandleFunc("/api/dkg-version", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env}
		handler.GetDKGVersion(w, r)
	}).Methods("GET")

	// health check
	r.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})

	gHandler := c.Handler(r)

	fmt.Printf("Running server on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, gHandler))
}
