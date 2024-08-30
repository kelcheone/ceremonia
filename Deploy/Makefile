# Variables
REPO_URL = git@github.com:kelcheone/ssv-dkg.git
REPO_DIR = ssv-dkg
INSTALL_DIR = /usr/local/bin
BINARY_NAME = ssv-dkg
BINARY_PATH = $(REPO_DIR)/bin/$(BINARY_NAME)

# Default target
all: clone install build move test

# Clone the repository
clone:
	@if [ ! -d "$(REPO_DIR)" ]; then \
		git clone $(REPO_URL); \
	else \
		echo "$(REPO_DIR) already exists."; \
	fi

# Run make install
install:
	@cd $(REPO_DIR) && make install

# Run make build
build:
	@cd $(REPO_DIR) && make build

# Move the binary to the global path
move:
	@if [ -f "$(BINARY_PATH)" ]; then \
		sudo mv $(BINARY_PATH) $(INSTALL_DIR)/$(BINARY_NAME); \
		echo "$(BINARY_NAME) has been moved to $(INSTALL_DIR)."; \
	else \
		echo "Binary not found in $(BINARY_PATH). Build might have failed."; \
	fi

# Clean up
clean:
	@rm -rf $(REPO_DIR)
	@echo "Cleaned up $(REPO_DIR)."

# Test if the binary is available globally by running ssv-dkg -v
test:
	@if command -v $(BINARY_NAME) &> /dev/null; then \
		echo "$(BINARY_NAME) is installed. Running '$(BINARY_NAME) -v' to check version:"; \
		$(BINARY_NAME) -v; \
	else \
		echo "$(BINARY_NAME) is not installed or not found in the PATH."; \
	fi

# Check if the binary is available globally
check:
	@if command -v $(BINARY_NAME) &> /dev/null; then \
		echo "$(BINARY_NAME) is available globally."; \
	else \
		echo "There was an issue installing $(BINARY_NAME)."; \
	fi

.PHONY: all clone install build move clean test check
