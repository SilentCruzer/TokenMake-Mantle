const hre = require("hardhat");
// NFT contract deployed to:  0x2418F98136f4C62aCBA9837e38056e85a30a5Ee6
async function main() {
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy("NFT Contract", "NFTST");

  await nft.deployed();
  console.log("NFT contract deployed to: ", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
