import React from 'react'
import { useRouter } from 'next/router'

export const NFTOptions = () => {
    const router = useRouter()
  return (
    <div className="grid grid-cols-3 place-items-center h-screen">
        <div className="hover:cursor-pointer" onClick={() => router.push("/nft/single")}>Launch a single NFT</div>
    <div className="hover:cursor-pointer" onClick={() => router.push("/nft/profile")}>Profile</div>
    <div className="hover:cursor-pointer" onClick={() => router.push("/nft/marketplace")}>Marketplace</div>
    </div>
  )
}
