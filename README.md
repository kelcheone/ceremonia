# Ceremonia DKG API

The DKG Ceremonies API is a Go application that provides an API for running DKG ceremonies using the SSV (Secret Shared Validator) protocol. The application is designed to be run as a service and provides endpoints for running DKG ceremonies. Once the ceremony is complete, the application generates the necessary files for the validators to participate in the SSV protocol.

This service makes it easier for non tech savvy users to run DKG ceremonies and participate  in the SSV protocol without having to deal with the complexities of running the ceremony manually using the command line.

## How to Run the DKG Ceremonies API

This documentation provides a comprehensive guide on how to run the DKG Ceremonies API application. Follow the steps below to set up and run the application.

## Prerequisites

- Ensure you have Go installed. The required version is specified in the [`Deploy/Makefile`](Deploy/Makefile).
- Ensure you have `make` installed.

## Directory Structure

The relevant files and directories for running the application are as follows:

```bash
├── bruno-dkg-client-api
├── Deploy
│   ├── Caddyfile
│   ├── dkg-api.service
│   ├── Makefile
├── initiator_logs
├── pkgs
│   └── wire
├── routes
│   └── dkg
├── servers
│   └── docker
├── tmp
└── utils

```

## Step-by-Step Guide

### 1. Install Go

First, install the required version of Go. You can do this using the [`Makefile`](Makefile):

```sh
cd Deploy
make install_go
```

### 2. Download and Install the SSV-DKG Binary

Download the binary and make it executable:

```sh
make all_ssv_dkg
```

### 3. Build the DKG API Binary

Navigate to the [`Deploy`](Deploy) directory and run the following command to build the DKG API binary:

```sh
make all_dkg_api
```

This command will:

- Install Go dependencies.
- Build the binary and place it in the `./bin` directory.

### 4. Configure the Service

The service configuration is defined in the dkg-api.service file. Ensure the paths and user/group settings are correct for your environment.

### 5. Start the Service

To start the service, you need to copy the [`dkg-api.service`](Deploy/dkg-api.service) file to the systemd directory and enable it:

```sh
sudo cp Deploy/dkg-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable dkg-api.service
sudo systemctl start dkg-api.service
```

### 6. Verify the Service

Check the status of the service to ensure it is running correctly:

```sh
sudo systemctl status dkg-api.service
```

### 7. Configure the Caddy Server

The Caddy server configuration is defined in the [`Caddyfile`](Deploy/Caddyfile). Ensure the configuration is correct for your environment.

**Remember to replace the placeholders with the actual values.**

To start the Caddy server, run the following command:

if you have caddy installed on your machine, you can run the following command in the Deploy directory:

```sh
caddy reload --config Caddyfile
```

if you can follow isntructions on how to install caddy on your machine, you can follow the instructions on the [caddy website](https://caddyserver.com/docs/install)

### 8. Testing the Endpoints

You can test the API endpoints using tools like `curl` or Postman. The main endpoints are:

- `POST /api/run-dkg` - Runs the DKG ceremony.
- `GET /api/get-file/{sessionId}` - Retrieves generated files.
- `GET /api/health` - Health check endpoint.

If you have the Bruno api client, you can load the collection provided in [bruno-dkg-client-api](bruno-dkg-client-api) and test the endpoints.

Example `curl` command to run the DKG ceremony:

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
  "validators": 10,
  "operatorIds": [
    11,
    21,
    24,
    29
  ],
  "operatorsInfo": [
    {
      "id": 11,
      "public_key": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBN2Z4NmJNUjJIbDYrcWx5ekxVNC8KeElINDRzaS9haEhzZGFrMkwxclFWWi9nRVV5cFI3Qm1ZbGJYeXhNQVlhajBFaWt0dEtLVUY1ZlRodlBSMmRJUQpuQkZkVGppR3NsMVBGTXNLZWQrRjZQSmxpMmpRZHpyUTBTcElZYWkzVkRFYXRiY3BmUXdaYUpKOHhpdVB1TTJjClJYQjBwMUpSWE53U3phR2NLZmVseGtOcXRpS2wyZ0pnQWlFRkFOMEUzblpHeHBnRURxZUxyYzFNWXd0Z2dSWloKcVI2dGVyT2FlZzB6MnMzZnJPOTNmUnlyUHA4MU9XKzZOSnZBdit5ZE4yRmtlYjVPT1BNZDVRU2JTcFN2Y2ZlSwp1VVZxaTVkRlJXYzBkdmkydWtYaWVLSG1kZzluQTdVSVdienNxdm5KT0pRMkFtTzd3WE16WnE5dEFQSy9DcE1YCjBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "ip": "https://18.130.205.68:3030"
    },
    {
      "id": 21,
      "public_key": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcC82UFVpdG41dHN0d2wvVVIxRGIKV2N6c3FJeDBlNGlzc3JDVC9LUFpHUXBlczZNaDN3YjVOb1hRcWM4NXpKK1UvOGZsYkpvck02bGV6M0Z2REJzcgprTFd3QldOSDFOT3BlRG1mMFk1N1gvaWdxNFBQUEZxNlN5bUpmUHlvT3M4YjJDYzk4Tlc2d0hDZ3kxODd1WTc1Ci94MHpLc3J3QjhIQnpLSnpaeDdvZ1EvL1hxU1ovZHhQYU5rbjBzajUzMnlDZHlJTGV2OWppVmdpRzZVLytmcG0KK1JjaHdEa2xxMlpCVjByWXgvZGRBbUptZXZlVFRKUEVCcEJld1FNMThtUEFPaVlGeG9qdmYzTVpBeVRMMFhkNQpjZkVqYWxQNzBCLytueGlKS0RRaE9sdkpMYmdsaU5PendHVnI1V1F0RjhaTGhvZDNpYWo3YkxsVE1hZllMVmZwCmJRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "ip": "https://holesky-ssv-lido-dkg.ipetkov.eu:443"
    },
    {
      "id": 24,
      "public_key": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBc2pPeTZqaGI5V3JER2lWcnJXLysKVE9nRmRDVE4rcjBJSFdWSzlGb2JhSFNobG5XV21XKzdMQlNlUW55NTc1Y0JSSG5iUVpxa1ZXTzZTOUkxV3hiWgpCb1g1fjFob041M01jVDNuUVVxS2d2SVV5d3NLTW50ZmwrTnF4bkJHZ09tcDQ3RTlmVnpaVk5SdlROQys5dnVvCnNxcFV5SzhNQXJTT01IdFlmVnM2eXFYSXhwdUs2ZVFpOFJGcGpPcmU0Y0diTHZaNy9wT3ZqMytDdDZFYkNBQkEKQWVNeUoxdlQ3WHJmS28xSUxYVFZaL3V1b3ltV1pkd3hEbFFCTE1ZdHRxaE03amh4SHpkOEJLVVB5L1BkR1lLWApnRWVSelFSRGFLVUIwWHc0d0R2WCtjQ2JQUU02SkcxUVgyeE5GQ251cUZFcVV0eWVDbU9NT0NzcVJEYU0wMkZsCkpRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "ip": "https://ssv-dkg.holesky.blockshard.io:3030"
    },
    {
      "id": 29,
      "public_key": "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBenB6b0JGVEd3MmFNZWhONFZJL2sKSHdRNW5vb3YzWkoxWkU1NTFRazZydVprazlabDJuc081cmpQaU9RbWZQVWFIU0RvYlMraTU0dzZGMGtlNG9xVgpXRkpkbzVSVEl2Z1RCM2JhbkdBczk3VFl3SWIwTWtFQW1HamF5YkFieGtyNllzU2hLUkZIcnJjRnBMai94TmlqCnFuNDAyMjNBNUV2TkNUUVN2VWQxQU1kRkNDdlMvY0IvTldBL0FzczJmSXJIQWhKT2l6aHhuMHJTTXN1am40Rm4KMXZYL3VvR0FFaTQ1dGlWaWJlQlUxNFZuQXRLdlFYOWpqbFAvSjNVYmNxV3NaVzZ4bFlsdGozSU05OHJvTFU4bApRbjFUSE9sSHBYRVpTQmpYK0U1Ti9ibWEvUTN6SlJ4UkNsci8yanYrUXl6a2N0T3JadjR6OWVzNDFydDRxTm1vCllRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "ip": "https://57.128.65.88:3030" 
    }
  ],
  "ownerAddr": "0x81592c3de184a3e2c0dcb5a261bc107bfa91f494",
  "nonce": 4,
  "withdrawAddr": "0xa1a66cc5d309f19fb2fda2b7601b223053d0f7f4",
  "network": "holesky"
}' \
  http://localhost:8090/api/run-dkg
```

## Conclusion

And that is it! You have successfully set up and run the DKG Ceremonies API application. If you encounter any issues, please open an issue on here.
