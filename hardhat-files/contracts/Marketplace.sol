//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    uint256 public itemCounter;
    address payable owner;
    uint256 public listingPrice;

    struct MarketItem {
        uint256 itemId;
        address nftContractAddress;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isSold;
        bool isPresent;
    }

    mapping(uint256 => MarketItem) private marketItems;

    event MarketItemListed(
        uint256 indexed itemId,
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    constructor() {
  		itemCounter = 0;
  		owner = payable(msg.sender);
  		listingPrice = 0.01 ether;
	}

    function listMarketItem(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    ) public payable {
        require(msg.value == listingPrice, "Must pay the listing price");
        require(price > 0, "Price must be greater than 0");

        marketItems[itemCounter] = MarketItem(
        itemCounter,
        nftContractAddress,
        tokenId,
        payable(msg.sender),
        address(0),
        price,
        false,
        true
    );

    IERC721(nftContractAddress).transferFrom(
        msg.sender,
        address(this),
        tokenId
    );

    payable(owner).transfer(listingPrice);

    emit MarketItemListed(
        itemCounter,
        nftContractAddress,
        tokenId,
        msg.sender,
        address(0),
        price
    );

    itemCounter += 1;
    }


}