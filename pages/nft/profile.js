import React, {useEffect, useState, useRef} from 'react'
import { ethers } from 'ethers';
import { abi } from '@/constants';

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

        setTokenData(old => [...old, responseData])

      }));
    }

    getUserTokens();
    console.log(tokenData)
  }, []);
  return (
    <div>Profile
      <div>
        {tokenData?.map((item) => {
          return <div>
            <div>{item.name}</div>
            <div>{item.description}</div>
            <div>{item.image}</div>
            <div>{item.external_link}</div>
            <br />
            </div>
        })}
      </div>
    </div>
  )
}

export default Profile