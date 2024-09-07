SSV_DGK_BINARY_URL = https://github.com/kelcheone/ssv-dkg/releases/download/v2.1.0-24-windows/ssv-dkg-windows.exe
SERVER_BINARY_URL =https://github.com/kelcheone/ceremonia/releases/download/ceremonia-v1.0.0/dkg-api.exe

.PHONY: help
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help              Display this help message"
	@echo "  download-binaries Download binaries"
	@echo "  install_yarn      Install yarn"
	@echo "  install           Install node modules"
	@echo "  build             Build the election app"
	@echo "  build-exe	 Build the Windows executable"

.PHONY: download-binaries
download-binaries: ## Download binaries
	mkdir -p bin
	curl -L $(SSV_DGK_BINARY_URL) -o bin/ssv-dkg-windows.exe
	curl -L $(SERVER_BINARY_URL) -o bin/dkg-api.exe

.PHONY: install_yarn
install_yarn: ## Install yarn
	npm install -g yarn

.PHONY: install
install: ## Install node modules
	yarn install

.PHONY: build
build: ## Build the election app
	yarn build

.PHONY: build-exe
build-exe: ## Build the Windows executable
	yarn dist:win

