import React, {useEffect, useState, useRef} from 'react'
import { ethers } from 'ethers';
import { abi, marketAbi } from '@/constants';

var provider;

if (typeof window !== "undefined") {
  provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
}


const Profile = () => {

  const [tokenURI, setTokenURI] = useState(new Set());
  const [tokenData, setTokenData] = useState([{}]);
  const dataFetchedRef = useRef(false);
  useEffect(() => {

    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
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

    getUserTokens();
    console.log(tokenData)
  }, []);


  async function listNft(id) {
    const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
    const signer = provider.getSigner();
    await tokenContract.connect(signer).approve(process.env.NEXT_PUBLIC_MADDRESS, id);
    const marketContract = new ethers.Contract(process.env.NEXT_PUBLIC_MADDRESS, marketAbi, provider);
    
    const listToken = await marketContract.connect(signer).listMarketItem(process.env.NEXT_PUBLIC_CADDRESS,id,ethers.utils.parseEther("0.1"),{
      value: ethers.utils.parseEther("0.01"),
    });

  }
  return (
    <div>Profile
      <div>
        {tokenData?.map((item) => {
          return <div>
            {(item.name !== undefined)? (<div><div>{item.name}</div>
            <div>{item.description}</div>
            <div>{item.image}</div>
            <div>{item.external_link}</div>
            <button onClick={() => listNft(item.id)}>Sell</button>
            <br /><br /></div>) : (<div></div>)}
            </div>
        })}
      </div>
    </div>
  )
}

export default Profile