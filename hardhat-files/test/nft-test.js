const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Smart Contract Tests", function (){
    this.beforeEach(async function() {
        const NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy("NFT Contract", "NFTST");
    })

    it("NFT is minted successfully", async function() {
        [account1] = await ethers.getSigners();

        expect(await nft.balanceOf(account1.address)).to.equal(0);

        const tokenURI = "https://opensea-creatures-api.herokuapp.com/api/creature/1";
        const tx = await nft.connect(account1).mint(tokenURI);
        
        expect(await nft.balanceOf(account1.address)).to.equal(1);
    })

    it("tokenURI is set sucessfully", async function() {
        [account1, account2] = await ethers.getSigners();

        const tokenURI_1 = "https://opensea-creatures-api.herokuapp.com/api/creature/1"
        const tokenURI_2 = "https://opensea-creatures-api.herokuapp.com/api/creature/2"

        const tx1 = await nft.connect(account1).mint(tokenURI_1);
        const tx2 = await nft.connect(account2).mint(tokenURI_2);

        expect(await nft.tokenURI(0)).to.equal(tokenURI_1);
        expect(await nft.tokenURI(1)).to.equal(tokenURI_2);
    })
})