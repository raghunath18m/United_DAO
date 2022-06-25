const { ethers } = require("hardhat");
require("dotenv").config({ path:".env"});
require("@nomiclabs/hardhat-etherscan");

async function main() {
    const whitelistContract = await ethers.getContractFactory("Whitelist");

    const deployedWhitelistContract = await whitelistContract.deploy(20);

    await deployedWhitelistContract.deployed();

    console.log("whitelist contract address",deployedWhitelistContract.address);

    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
    await sleep(100000);

  // Verify the contract after deploying
    await hre.run("verify:verify", {
        address: deployedWhitelistContract.address,
        constructorArguments: [20],
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
