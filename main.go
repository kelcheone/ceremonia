package main

import (
	dockerServer "github.com/kelcheone/ceremonia/servers/docker"
)

func main() {
	port := ":8090"
	newDockerServer := dockerServer.DockerSerVer{}

	newDockerServer.Start(port)
}
