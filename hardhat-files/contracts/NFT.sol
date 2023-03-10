//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    uint256 public tokenCounter;

    mapping(address => uint256[]) public tokenHolders;

    mapping (uint256 => string) private _tokenURIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){
        tokenCounter=0;
    }

    function mint(string memory _tokenURI) public {
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, _tokenURI);

        tokenCounter++;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual{
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");

        _tokenURIs[_tokenId] = _tokenURI;
        tokenHolders[msg.sender].push(_tokenId);
    }

    function getUserTokenId(address user) public view returns(uint256[] memory){
        return tokenHolders[user];
    }


    function tokenURI(uint256 _tokenId) public view virtual override returns(string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");

        return _tokenURIs[_tokenId];
    }

    function setNewOwner(address oldOwner, address newOwner,uint256 _tokenID) external {
        for(uint i=0;i<tokenHolders[oldOwner].length;i++){
            if(tokenHolders[oldOwner][i] == _tokenID){
                delete tokenHolders[oldOwner][i];
            }

            tokenHolders[newOwner].push(_tokenID);
        }
    }
}

