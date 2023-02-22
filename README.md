# <b>TokenMake-Mantle</b>
TokenMake is a dapp that runs on the [Mantle testnet](https://www.mantle.xyz/)
TokenMake has two main smart contracts - one for NFT minting and another for the marketplace
The NFT minting contract uses the token URI as a parameter to mint the NFT
The contract has two main mappings - one for tracking the token URIs using the user's address and another for tracking the ownership of the token using the user's address
The marketplace contract includes functions for listing the user's NFTs on the Mantle testnet
After a user buys an NFT, the marketplace contract uses an interface of the NFT minting contract to update the token holders.

With the inplementation of [nft.storage](https://nft.storage/), the user can upload their metadata to ipfs with ease.

Note: There is no current implementation of UI, it just displays the content in normal text format right now for testing. The front end has been intialized with Next Js and tailwind css, so the UI can be implemented in the future

<b>NFT contract deployed to: </b> [0x3De3F669025d5abC59769d69C45883B27aC6752e](https://explorer.testnet.mantle.xyz/address/0x3De3F669025d5abC59769d69C45883B27aC6752e)

<b>Marketplace contract deployed to: </b> [0xF63D3fB65C5168487324C3EE3C547104324d8FBd](https://explorer.testnet.mantle.xyz/address/0xF63D3fB65C5168487324C3EE3C547104324d8FBd)
## <b>Code Snippets</b>
<hr />

### <b>Frontend</b>

### Mint NFT: 

 ```javascript
 const onSubmit = async (e) => {
        e.preventDefault();

        const cid = await client.store({
            name: name,
            external_link: externalLink,
            description: description,
            image: imageFile,
            attributes: attributesList,
          });

          console.log(cid.url);

        const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
        const tx = await tokenContract.connect(provider.getSigner()).mint(cid.url);

        console.log("NFT Minted!!!!")
      }
``` 

### Fetch users NFT'S:

 ```javascript
 async function getUserTokens() {
      const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
      const signer = provider.getSigner();
      const data = await tokenContract.getUserTokenId(signer.getAddress());

      await Promise.all(data.map(async (item) => {
        const uri = await tokenContract.tokenURI(item["_hex"]);
        setTokenURI(oldItems => new Set([...oldItems, uri]));


        const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
        const responseData = await response.json();

        responseData["id"] = item["_hex"];

        setTokenData(old => [...old, responseData])

      }));
    }
``` 

### <b>NFT contract</b>

### Constructor: 

 ```solidity 
constructor(string memory name, string memory symbol) ERC721(name, symbol){
        tokenCounter=0;
    }
``` 

### setTokenURI: 

 ```solidity 
function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal virtual{
        require(_exists(_tokenId), "ERC721Metadata: URI set of nonexistent token");

        _tokenURIs[_tokenId] = _tokenURI;
        tokenHolders[msg.sender].push(_tokenId);
    }
``` 

### Mint function: 

 ```solidity 
 function mint(string memory _tokenURI) public {
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, _tokenURI);

        tokenCounter++;
    }
``` 

### setNewOwner function: 

 ```solidity 
 function setNewOwner(address oldOwner, address newOwner,uint256 _tokenID) external {
        for(uint i=0;i<tokenHolders[oldOwner].length;i++){
            if(tokenHolders[oldOwner][i] == _tokenID){
                delete tokenHolders[oldOwner][i];
            }

            tokenHolders[newOwner].push(_tokenID);
        }
    }
``` 
<br />

### <b>Marketplace contract</b>

### List Item: 

 ```solidity 
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
``` 

### Buy Item: 

 ```solidity 
 function buyMarketItem(address nftAddress,uint256 itemId) public payable {
        require(marketItems[itemId].isPresent, "Item is not present");
        require(marketItems[itemId].isSold == false, "Item is already sold");
        require(
            marketItems[itemId].price == msg.value,
            "Must pay the correct price"
        );

        INFT(nftAddress).setNewOwner(msg.sender,marketItems[itemId].owner,marketItems[itemId].tokenId);

        marketItems[itemId].isSold = true;
        marketItems[itemId].owner = payable(msg.sender);



        IERC721(marketItems[itemId].nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            marketItems[itemId].tokenId
        );
    }
```