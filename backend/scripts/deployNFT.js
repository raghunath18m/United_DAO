const { ethers } = require("hardhat");
require("dotenv").config({ path:".env"});
require("@nomiclabs/hardhat-etherscan");
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

async function main() {
    const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
    const metadataURL = METADATA_URL;

    const NFTContract = await ethers.getContractFactory("NFT");

    const deployedNFTContract = await NFTContract.deploy(
        metadataURL,
        whitelistContract
    );

    console.log(
        "NFT Contract Address:",
        deployedNFTContract.address
    );

    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
    await sleep(100000);

  // Verify the contract after deploying
    await hre.run("verify:verify", {
        address: deployedNFTContract.address,
        constructorArguments: [metadataURL, whitelistContract],
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

main()
.then(()=> process.exit(0))
.catch((error)=>{
    console.log(error);
    process.exit(1);
});
