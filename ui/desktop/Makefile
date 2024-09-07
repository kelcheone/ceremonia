SSV_DGK_BINARY_URL = https://github.com/kelcheone/ssv-dkg/releases/download/v2.1.0/ssv-dkg
SERVER_BINARY_URL = https://github.com/kelcheone/ceremonia/releases/download/ceremonia-v1.0.0/dkg-api



.PHONY: help
help: ## Show this help message
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help              Display this help message"
	@echo "  download-binaries Download binaries"
	@echo "  install_yarn      Install yarn"
	@echo "  install           Install node modules"
	@echo "  build             Build the election app"
	@echo "  build-appimage    Build the AppImage"

	

#  download binaries and create a directory called bin to store them (use curl)
.PHONY: download-binaries
download-binaries: ## Download binaries
	mkdir -p bin
	curl -L $(SSV_DGK_BINARY_URL) -o bin/ssv-dkg
	curl -L $(SERVER_BINARY_URL) -o bin/dkg-api
	chmod +x bin/ssv-dkg
	chmod +x bin/dkg-api


# download node modules using yarn. so install yarn first
.PHONY: install_yarn
install_yarn: ## Install yarn
	npm install -g yarn


# install node modules using yarn
.PHONY: install
install: ## Install node modules
	yarn install


# build the election app
.PHONY: build
build: ## Build the election app
	yarn build


#  The AppImage is required for release on GitHub
.PHONY: build-appimage
build-appimage: ## Build the AppImage
	yarn dist:linux

