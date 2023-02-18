const hre = require("hardhat");
// NFT contract deployed to:  0x3De3F669025d5abC59769d69C45883B27aC6752e
async function main() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("Mantle Powered NFT", "MPN");

  await nft.deployed();
  console.log("NFT contract deployed to: ", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
