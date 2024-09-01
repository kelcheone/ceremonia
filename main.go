package main

import dockerServer "github.com/kelcheone/ceremonia/servers/docker"

func main() {
	newServer := dockerServer.DockerSerVer{}
	newServer.Start("8090")
}
