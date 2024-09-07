SSV_DGK_BINARY_URL = https://github.com/kelcheone/ssv-dkg/releases/download/v2.1.0-36-macOS/ssv-dkg-darwin
SERVER_BINARY_URL =https://github.com/kelcheone/ceremonia/releases/download/ceremonia-v1.0.0/dkg-api-darwin

.PHONY: help
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help              Display this help message"
	@echo "  download-binaries Download binaries"
	@echo "  install_yarn      Install yarn"
	@echo "  install           Install node modules"
	@echo "  build             Build the election app"
	@echo " build-dmg         Build the macOS executable"

.PHONY: download-binaries
download-binaries: ## Download binaries
	mkdir -p bin
	curl -L $(SSV_DGK_BINARY_URL) -o bin/ssv-dkg
	curl -L $(SERVER_BINARY_URL) -o bin/dkg-api
	chmod +x bin/ssv-dkg
	chmod +x bin/dkg-api

.PHONY: install_yarn
install_yarn: ## Install yarn
	npm install -g yarn

.PHONY: install
install: ## Install node modules
	yarn install
	yarn add dmg-license


.PHONY: build
build: ## Build the election app
	yarn build

.PHONY: build-dmg
build-dmg: ## Build the macOS executable
	yarn dist:mac

