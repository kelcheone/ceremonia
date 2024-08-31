# Ceremonia

This user interface is a web application that allows users to interact with the DKG service. It provides a user-friendly interface for initiating and participating in the DKG ceremony.

This guide will help you set up and run the frontend application located in the `ui` (this folder) directory. The frontend is built using Next.js and requires certain environment variables to be configured before running.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 20.0 LTS or higher)
- npm (Node Package Manager)

## Environment Variables

Before running the application, you need to set the following environment variables in a `.env` file located in the `ui` directory:

```properties
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_INFURA_KEY=
NEXT_PUBLIC_DKG_HOST=
```

### Description of Environment Variables

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID.
- `NEXT_PUBLIC_INFURA_KEY`: Your Infura project key for connecting to the Ethereum network. (You can replace this with any other Ethereum node provider.)
- `NEXT_PUBLIC_DKG_HOST`: The host URL for the DKG service.

## Steps to Run the Frontend

1. **Install dependencies:**

    ```sh
    pnpm install
    ```

2. **Create and configure the `.env`file:**

    Create a file named `.env` in the [`ui`](ui) directory and add the required environment variables:

    ```sh
    echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id" >> .env
    echo "NEXT_PUBLIC_INFURA_KEY=your_infura_key" >> .env
    echo "NEXT_PUBLIC_DKG_HOST=your_dkg_host_url" >> .env
    ```

3. **Run the development server:**

    ```sh
    pnpm run dev
    ```

    This will start the Next.js development server. You can view the application by navigating to `http://localhost:3000` in your web browser.

## Building for Production

To build the application for production, run:

```sh
pnpm build
```

After the build is complete, you can start the production server with:

```sh
pnpm start
```

This will start the application in production mode.

## Linting

To lint the codebase, run:

```sh
pnpm lint
```

This will check the code for any linting errors based on the configured ESLint rules.
