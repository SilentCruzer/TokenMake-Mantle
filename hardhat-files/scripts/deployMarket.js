const hre = require("hardhat");
// Marketplace contract deployed to:  0xF63D3fB65C5168487324C3EE3C547104324d8FBd
async function main() {
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();

  await marketplace.deployed();
  console.log("Marketplace deployed to: ", marketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
