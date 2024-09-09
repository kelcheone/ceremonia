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
	env      = "prod"
	port     = "8090"
	Platform string
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

	if len(args) >= 4 {
		Platform = args[3]
	}

	fmt.Println(env)
	fmt.Println(port)
	fmt.Println(Platform)
}

func main() {
	r := mux.NewRouter()

	fmt.Println("-------------------The app is now running-------------------")
	func() {
		handler := &dkgHandler.DKGHandler{Env: env, Platform: Platform}
		version, err := handler.RunVersionCommand()
		if err != nil {
			fmt.Println("Error getting version: ", err)
		}
		fmt.Printf("Version: %+v\n", version.Version)
	}()

	r.HandleFunc("/api/run-dkg", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env, Platform: Platform}
		handler.RunDKGHandler(w, r)
	}).Methods("POST")

	r.HandleFunc("/api/get-file/{sessionId}", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env, Platform: Platform}
		handler.ServeGeneratedFiles(w, r)
	}).Methods("GET")

	r.HandleFunc("/api/dkg-version", func(w http.ResponseWriter, r *http.Request) {
		handler := &dkgHandler.DKGHandler{Env: env, Platform: Platform}
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
