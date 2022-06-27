const { ethers } = require("hardhat");
require("dotenv").config({ path:".env"});
require("@nomiclabs/hardhat-etherscan");
const { NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  // Deploy the FakeNFTMarketplace contract first
  const FakeNFTMarketplace = await ethers.getContractFactory(
    "FakeNFTMarketplace"
  );
  const fakeNftMarketplace = await FakeNFTMarketplace.deploy();
  await fakeNftMarketplace.deployed();

  console.log("FakeNFTMarketplace deployed to: ", fakeNftMarketplace.address);

  // Now deploy the DAO contract
  const DAOContract = await ethers.getContractFactory("DAO");
  const dao = await DAOContract.deploy(
    fakeNftMarketplace.address,
    NFT_CONTRACT_ADDRESS,
    {
      value: ethers.utils.parseEther("0.001"),
    }
  );
  await dao.deployed();

  console.log("dao deployed to: ", dao.address);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
    await sleep(100000);

  // Verify the contract after deploying
    await hre.run("verify:verify", {
        address: dao.address,
        constructorArguments: [
            fakeNftMarketplace.address,
            NFT_CONTRACT_ADDRESS
        ],
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });