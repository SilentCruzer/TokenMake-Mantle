import React, {useEffect, useState, useRef} from 'react'
import { ethers } from 'ethers';
import { abi, marketAbi } from '@/constants';

var provider;

if (typeof window !== "undefined") {
  provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
}

const marketplace = () => {
    const dataFetchedRef = useRef(false);
    const [marketItems, setMarketItems] = useState([]);
    
    useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
        async function getMarketItems() {
            const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_MADDRESS, marketAbi, provider);
            const itemCount = parseInt(await marketContract.itemCounter());
            console.log(itemCount);

            for(let i=0; i<itemCount; i++){
                const itemData = await marketContract.getMarketItem(0);
                const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
                if(!itemData.isSold){
                    const tokenURI = await tokenContract.tokenURI(itemData.tokenId["_hex"]);

                const response = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"));
                const responseData = await response.json();
                const newItem = {
                    marketId: i,
                    metadata : responseData,
                    listing : itemData
                };

                setMarketItems(old => [...old, newItem])
                } else {
                    continue;
                }
            }
        }

        getMarketItems();
        console.log(marketItems);
    }, []);

    async function buyNft(id, marketId, price) {
        const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
        const signer = provider.getSigner();
        await tokenContract.connect(signer).approve(process.env.NEXT_PUBLIC_MADDRESS, marketId);
        const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_MADDRESS, marketAbi, provider);
        console.log(signer.getAddress())
        const buyToken = await marketContract.connect(signer).buyMarketItem(marketId,{
          value: ethers.utils.parseEther(price),
        });
    
      }

  return (
    <div>
        {
            marketItems.map((item) => {
                return <div>
                    <div>{item.metadata.name}</div>
                    <div>{item.listing.tokenId["_hex"]}</div>
                    <div>{item.metadata.image}</div>
                    <div>{ethers.utils.formatEther(item.listing.price["_hex"])}</div>
                    <button onClick={() => buyNft(item.listing.tokenId["_hex"], item.marketId, ethers.utils.formatEther(item.listing.price["_hex"]))}>Buy</button>
                    
                </div>
            })
        }
    </div>
  )
}

export default marketplace