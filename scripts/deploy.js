const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  await upload.deployed();

  console.log("Upload contract deployed to:", upload.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during contract deployment:", error);
    process.exit(1);
  });