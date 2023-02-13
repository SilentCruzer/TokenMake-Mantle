import { NFTOptions } from '@/components/Main/NFTOptions';
import { ethers, ethereum } from 'ethers';
import { useState, useEffect } from 'react';

var provider;

if (typeof window !== "undefined") {
  provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
}


export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [currentChain, setCurrentChain] = useState({});

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      await checkConnection();
      if( localStorage?.getItem("isWalletConnected") === "true") {
        await accountChangedHandler(provider.getSigner());
        setIsConnected(true);
      }
    }  
    const checkConnection = async () =>  {
      const accounts = await provider.listAccounts()
      if(accounts.length === 0){
        localStorage?.setItem("isWalletConnected", false);
        setIsConnected(false)
      }
      
    }
    connectWalletOnPageLoad()
  }, []);

  const connectWalletHandler = () => {
    if(window.ethereum) {
      console.log('detected')
      provider.send("eth_requestAccounts", []).then(async () => {
          await accountChangedHandler(provider.getSigner());
          localStorage?.setItem("isWalletConnected", true);
          setIsConnected(true);
      })
    } else {
      setErrorMessage("Please install Metamask")
    }
  }

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();
    setDefaultAccount(address);
    const balance = await newAccount.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));
    const chainId = await provider.getNetwork();
    setCurrentChain(chainId)
  }


  return (
    <div>
      <h1>
      </h1>
      {isConnected ? (
        <div>
        {/* <h1>Address: {defaultAccount}</h1>
        <h3>Wallet Amount: {userBalance}</h3>
        <h1>Chain Id: {currentChain.chainId}</h1> */}
        <NFTOptions />
      </div>
      ) : (<div>
        <button onClick={connectWalletHandler}>
        {isConnected ? "Connected" : "Connect"}
      </button>{errorMessage}
      </div>

      )}
     
    </div>
  )
}
