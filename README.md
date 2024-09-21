# Healthcare E-Vault Contract

## Overview

This project is a smart contract for managing file uploads and sharing access among users. Users can add files, remove them, and control access to their files.

## Prerequisites

- Node.js
- Hardhat
- Metamask

## Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd Healthcare_E_Vault
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Hardhat Network

To simulate an Ethereum network locally, run:

```bash
npx hardhat node
```

This command starts a local Ethereum network with several accounts pre-funded with test ETH.

## Deploying the Contract

In a new terminal window, deploy the contract using:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy the `Upload` contract and provide the deployed address.

## Interacting with the Contract

Open a Hardhat console to interact with the deployed contract:

```bash
npx hardhat console --network localhost
```

### Step 1: Setting Up Contract Interaction

In the console, run the following commands to get the contract factory and attach it to the deployed instance:

```javascript
const Upload = await ethers.getContractFactory("Upload");
const uploadInstance = await Upload.attach("<deployed_contract_address>");
```

Replace `<deployed_contract_address>` with the address provided after deployment.

### Step 2: Adding Files

Add files to your account with:

```javascript
await uploadInstance.add("<your_account_address>", "ipfs://example-file-url");
await uploadInstance.add("<your_account_address>", "ipfs://file2");
await uploadInstance.add("<your_account_address>", "ipfs://file3");
```

### Step 3: Viewing Files

To view the files added to your account, run:

```javascript
const files = await uploadInstance.display("<your_account_address>");
console.log(files);
```

### Step 4: Removing a File

To remove a file by its index (e.g., first file):

```javascript
await uploadInstance.removeFile(0); // Removes the first file
```

### Step 5: Checking Updated Files

After removing a file, check the updated list of files:

```javascript
const updatedFiles = await uploadInstance.display("<your_account_address>");
console.log(updatedFiles);
```

### Step 6: Sharing Access

Share access to another user by running:

```javascript
await uploadInstance.allow("<other_user_address>");
```

### Step 7: Viewing Files with Shared Access

Switch to the other account and check the shared files:

```javascript
const otherAccountInstance = uploadInstance.connect("<other_user_address>");
const sharedFiles = await otherAccountInstance.display("<your_account_address>");
console.log(sharedFiles);
```

### Step 8: Revoking Access

To revoke access from a user:

```javascript
await uploadInstance.disallow("<other_user_address>");
```

## Conclusion

You can now manage file uploads and control access with this smart contract. Feel free to modify and expand its functionality as needed!

## License

This project is licensed under the MIT License.
```

### Notes:

- Make sure to replace placeholders like `<your-repo-url>` and `<your_account_address>` with the appropriate values.
- Adjust any sections based on specific functionalities or features of your contract as necessary.