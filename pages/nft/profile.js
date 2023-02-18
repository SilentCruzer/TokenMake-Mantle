import React, {useEffect} from 'react'
import { ethers } from 'ethers';
import { abi } from '@/constants';

var provider;

if (typeof window !== "undefined") {
  provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
}


const Profile = () => {
  useEffect(() => {

    async function getUserTokens() {
      const tokenContract = new ethers.Contract(process.env.NEXT_PUBLIC_CADDRESS, abi, provider);
      const data = await tokenContract.getUserTokenId(ethers.utils.getAddress("0xf4dC1e5fa9Ce1103d6BC206f86f881CFa12E2fFA"));
      console.log(data)
    }

    getUserTokens();
    
  }, []);
  return (
    <div>Profile</div>
  )
}

export default Profile