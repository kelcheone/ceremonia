# Variables
BINARY_URL = https://github.com/kelcheone/ssv-dkg/releases/download/v2.1.0/ssv-dkg
BINARY_NAME = ssv-dkg
INSTALL_DIR = /usr/local/bin
DOWNLOAD_DIR = /tmp
GO_VERSION = 1.22.0
SOURCE_CODE = ../
#help

.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  help       Display this help message"
	@echo "  install_go Install Go $(GO_VERSION)"
	@echo "  download   Download the ssv-dkg binary"
	@echo "  install_ssv_dkg   Make the ssv-dkg binary executable"
	@echo "  test_ssv_dkg       Test the installation"
	@echo "  clean_ssv_dkg      Clean up"
	@echo "  uninstall_ssv_dkg  Uninstall the ssv-dkg binary"
	@echo "  all_ssv_dkg  Download, install, test, and clean up the binary"
	@echo "  all_dkg_api  Install Go, install dependencies, build the binary"



.PHONY: install_go
install_go:
	@echo "Installing Go $(GO_VERSION)..."
	@curl -L https://golang.org/dl/go$(GO_VERSION).linux-amd64.tar.gz -o /tmp/go$(GO_VERSION).linux-amd64.tar.gz
	@sudo tar -C /usr/local -xzf /tmp/go$(GO_VERSION).linux-amd64.tar.gz
	@echo "export PATH=\$$PATH:/usr/local/go/bin" >> ~/.bashrc
	@echo "export GOPATH=\$$HOME/go" >> ~/.bashrc
	@echo "export PATH=\$$PATH:\$$GOPATH/bin" >> ~/.bashrc
	@. ~/.bashrc
	@rm -f /tmp/go$(GO_VERSION).linux-amd64.tar.gz

.PHONY: test_go
test_go:
	@echo "Testing Go installation..."
	@echo "go version: $(shell go version)"
	@echo "GOPATH: $(shell go env GOPATH)"
	@echo "GOROOT: $(shell go env GOROOT)"

# Download the binary
.PHONY: download_ssv_dkg
download:
	@echo "Downloading $(BINARY_NAME)..."
	@curl -L $(BINARY_URL) -o $(DOWNLOAD_DIR)/$(BINARY_NAME)

# Make the binary executable
.PHONY: install_ssv_dkg
install_ssv_dkg:
	@echo "Making $(BINARY_NAME) executable..."
	@chmod +x $(DOWNLOAD_DIR)/$(BINARY_NAME)
	@echo "Moving $(BINARY_NAME) to $(INSTALL_DIR)..."
	@sudo mv $(DOWNLOAD_DIR)/$(BINARY_NAME) $(INSTALL_DIR)/$(BINARY_NAME)

# Test the installation
.PHONY: test_ssv_dkg
test_ssv_dkg:
	@echo "Testing $(BINARY_NAME) installation..."
	@$(BINARY_NAME) -v

# Clean up
.PHONY: clean_ssv_dkg
clean_ssv_dkg:
	@echo "Cleaning up..."
	@rm -f $(DOWNLOAD_DIR)/$(BINARY_NAME)

# Uninstall the binary
.PHONY: uninstall_ssv_dkg
uninstall_ssv_dkg:
	@echo "Uninstalling $(BINARY_NAME)..."
	@sudo rm -f $(INSTALL_DIR)/$(BINARY_NAME)

.PHONY: all_ssv_dkg
all_ssv_dkg: download_ssv_dkg install_ssv_dkg test_ssv_dkg clean_ssv_dkg

.PHONY: dkg_dependencies
dkg_dependencies:
	cd $(SOURCE_CODE) && go mod download
	@echo "Dependencies downloaded"

.PHONY: build_dkg_api
build_dkg_api:
	cd $(SOURCE_CODE) && go build -o ./bin/dkg-api main.go
	@echo "Finished building the binary"

.PHONY: all_dkg_api
all_dkg_api: dkg_dependencies build_dkg_api


.PHONY: dkg_linux
dkg_linux:
	cd $(SOURCE_CODE) && GOOS=linux GOARCH=amd64 go build -o ./bin/dkg-api main.go
	@echo "Finished building the linux target binary"
