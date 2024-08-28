GOINSTALL = env GO111MODULE=on go install -v

install:
	$(GOINSTALL) -ldflags "-X main.Version=`git describe --tags $$(git rev-list --tags --max-count=1)`" main.go
	@echo "Done building."
	@echo "Run ssv-dkg to launch the tool."
